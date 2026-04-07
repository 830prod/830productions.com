#!/bin/zsh

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
INSTAGRAM_USERNAME="830_productions"
PROFILE_URL="https://www.instagram.com/${INSTAGRAM_USERNAME}/"
FEED_URL="https://www.instagram.com/api/v1/feed/user/${INSTAGRAM_USERNAME}/username/?count=3"
USER_AGENT="Mozilla/5.0"
APP_ID="936619743392459"

mkdir -p "${ROOT_DIR}/data" "${ROOT_DIR}/images" "${ROOT_DIR}/videos"

feed_json="$(mktemp /tmp/830-instagram-feed.XXXXXX)"
post_json="$(mktemp /tmp/830-instagram-post.XXXXXX)"
selected_json="$(mktemp /tmp/830-instagram-selected.XXXXXX)"
json_output="$(mktemp /tmp/830-instagram-output.XXXXXX)"
image_tmp="$(mktemp /tmp/830-instagram-image.XXXXXX)"
video_tmp=""

cleanup() {
  rm -f "$feed_json" "$post_json" "$selected_json" "$json_output" "$image_tmp"

  if [[ -n "$video_tmp" ]]; then
    rm -f "$video_tmp"
  fi
}

trap cleanup EXIT

curl -fsSL \
  -A "$USER_AGENT" \
  -H "x-ig-app-id: ${APP_ID}" \
  -H "Referer: ${PROFILE_URL}" \
  -H "Accept: application/json" \
  "$FEED_URL" \
  -o "$feed_json"

jq -e '.items and (.items | length > 0)' "$feed_json" > /dev/null
jq '.items[0]' "$feed_json" > "$post_json"
jq 'if .media_type == 8 then .carousel_media[0] else . end' "$post_json" > "$selected_json"

code="$(jq -r '.code // empty' "$post_json")"
taken_at="$(jq -r '.taken_at // 0' "$post_json")"
product_type="$(jq -r '.product_type // empty' "$post_json")"
caption="$(jq -r '.caption.text // empty' "$post_json")"
media_type_code="$(jq -r '.media_type // 0' "$selected_json")"
media_type="image"

if [[ -z "$code" ]]; then
  echo "Unable to determine the latest Instagram post code." >&2
  exit 1
fi

if [[ "$media_type_code" == "2" ]]; then
  media_type="video"
fi

permalink_path="p"

if [[ "$product_type" == "clips" ]]; then
  permalink_path="reel"
fi

permalink="https://www.instagram.com/${permalink_path}/${code}/"

image_url="$(jq -r '([.image_versions2.candidates[]?] | sort_by((.width // 0) * (.height // 0)) | last | .url) // empty' "$selected_json")"
video_url="$(jq -r '([.video_versions[]?] | sort_by((.width // 0) * (.height // 0)) | last | .url) // empty' "$selected_json")"
alt_text="$(jq -r '.accessibility_caption // empty' "$selected_json")"
width="$(jq -r '.original_width // .width // .image_versions2.candidates[0].width // 1080' "$selected_json")"
height="$(jq -r '.original_height // .height // .image_versions2.candidates[0].height // 1350' "$selected_json")"

if [[ -z "$image_url" ]]; then
  echo "Unable to determine the latest Instagram image URL." >&2
  exit 1
fi

if [[ ! "$taken_at" =~ ^[0-9]+$ ]]; then
  taken_at=0
fi

if [[ ! "$width" =~ ^[0-9]+$ ]]; then
  width=1080
fi

if [[ ! "$height" =~ ^[0-9]+$ ]]; then
  height=1350
fi

if [[ -z "$alt_text" ]]; then
  alt_text="Latest Instagram post from 830 Productions"
fi

curl -fsSL \
  -A "$USER_AGENT" \
  "$image_url" \
  -o "$image_tmp"

mv "$image_tmp" "${ROOT_DIR}/images/latest-instagram-featured.jpg"
chmod 644 "${ROOT_DIR}/images/latest-instagram-featured.jpg"
image_tmp="$(mktemp /tmp/830-instagram-image.XXXXXX)"

video_path=""

if [[ "$media_type" == "video" ]]; then
  if [[ -z "$video_url" ]]; then
    echo "Unable to determine the latest Instagram video URL." >&2
    exit 1
  fi

  video_tmp="$(mktemp /tmp/830-instagram-video.XXXXXX)"

  curl -fsSL \
    -A "$USER_AGENT" \
    "$video_url" \
    -o "$video_tmp"

  mv "$video_tmp" "${ROOT_DIR}/videos/latest-instagram-featured.mp4"
  chmod 644 "${ROOT_DIR}/videos/latest-instagram-featured.mp4"
  video_tmp=""
  video_path="videos/latest-instagram-featured.mp4"
else
  rm -f "${ROOT_DIR}/videos/latest-instagram-featured.mp4"
fi

jq -n \
  --arg code "$code" \
  --arg permalink "$permalink" \
  --arg mediaType "$media_type" \
  --arg imagePath "images/latest-instagram-featured.jpg" \
  --arg videoPath "$video_path" \
  --arg alt "$alt_text" \
  --arg caption "$caption" \
  --argjson takenAt "$taken_at" \
  --argjson width "$width" \
  --argjson height "$height" \
  '{
    code: $code,
    permalink: $permalink,
    takenAt: $takenAt,
    mediaType: $mediaType,
    imagePath: $imagePath,
    videoPath: $videoPath,
    alt: $alt,
    caption: $caption,
    width: $width,
    height: $height
  }' > "$json_output"

mv "$json_output" "${ROOT_DIR}/data/latest-instagram-post.json"
chmod 644 "${ROOT_DIR}/data/latest-instagram-post.json"
