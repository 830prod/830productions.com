/*
  830 Productions — photo albums
  ------------------------------------------------------------------
  Every album on the Work page (and the first few on the home page)
  comes from this list. To fill a senior album:

    1. Put the photos in its folder, e.g. images/albums/senior-01/
       (JPGs around 2000px on the long edge load fastest).
    2. List them under that album's `photos`, e.g.

         photos: [
           { src: 'images/albums/senior-01/01.jpg', alt: 'Senior portrait on the chapel steps' },
           { src: 'images/albums/senior-01/02.jpg', alt: 'Senior portrait in the garden' }
         ]

    3. Change `title` and `subtitle` to the senior's name and class year.

  Optional per photo: `thumb` (a smaller copy for the grid) and `caption`.
  The first photo is the cover unless `cover` is set.
  An album with no photos shows as "Photos coming soon".

  Categories drive the filter buttons: seniors, portraits, events, places, details.
*/

window.ALBUMS_830 = [
  {
    id: 'senior-01',
    title: 'Senior Album 01',
    subtitle: 'Class of 2027',
    category: 'seniors',
    photos: []
  },
  {
    id: 'senior-02',
    title: 'Senior Album 02',
    subtitle: 'Class of 2027',
    category: 'seniors',
    photos: []
  },
  {
    id: 'senior-03',
    title: 'Senior Album 03',
    subtitle: 'Class of 2027',
    category: 'seniors',
    photos: []
  },
  {
    id: 'campus-and-stone',
    title: 'Campus & Stone',
    subtitle: 'Gothic arches, chapel light',
    category: 'places',
    photos: [
      { src: 'images/web/campus-tower-l.jpg', thumb: 'images/web/campus-tower-m.jpg', alt: 'Stone bell tower under a heavy grey sky' },
      { src: 'images/web/campus-arch-l.jpg', thumb: 'images/web/campus-arch-m.jpg', alt: 'Stone steps leading up to a gothic archway' },
      { src: 'images/web/campus-chapel-l.jpg', thumb: 'images/web/campus-chapel-m.jpg', alt: 'Bare tree framing a campus chapel across the lawn' }
    ]
  },
  {
    id: 'portraits',
    title: 'Portraits',
    subtitle: 'People, and one very good dog',
    category: 'portraits',
    photos: [
      { src: 'images/web/balloon-portrait-l.jpg', thumb: 'images/web/balloon-portrait-m.jpg', alt: 'Two men in suits and hats standing in a hot air balloon basket' },
      { src: 'images/web/winston-l.jpg', thumb: 'images/web/winston-m.jpg', alt: 'White terrier looking up, soft green background' }
    ]
  },
  {
    id: 'live',
    title: 'Live & Events',
    subtitle: 'Stage light and crowds in motion',
    category: 'events',
    photos: [
      { src: 'images/web/cellist-l.jpg', thumb: 'images/web/cellist-m.jpg', alt: 'Cellist performing on a dark stage' },
      { src: 'images/web/crowd-l.jpg', thumb: 'images/web/crowd-m.jpg', alt: 'Long exposure of a crowd moving through a holiday market' }
    ]
  },
  {
    id: 'winter-light',
    title: 'Winter Light',
    subtitle: 'Snow roads and quiet signs',
    category: 'places',
    photos: [
      { src: 'images/web/winter-road-l.jpg', thumb: 'images/web/winter-road-m.jpg', alt: 'Snow-covered road winding through bare woods' },
      { src: 'images/web/winter-sign-l.jpg', thumb: 'images/web/winter-sign-m.jpg', alt: 'Black and white photo of a snow-covered emergency route sign' }
    ]
  },
  {
    id: 'field-notes',
    title: 'Field Notes',
    subtitle: 'Details found between shoots',
    category: 'details',
    photos: [
      { src: 'images/web/taillight-l.jpg', thumb: 'images/web/taillight-m.jpg', alt: 'Glowing red tail light on a dark car at night' },
      { src: 'images/web/gull-l.jpg', thumb: 'images/web/gull-m.jpg', alt: 'Gull gliding against a deep blue sky' },
      { src: 'images/web/giraffe-l.jpg', thumb: 'images/web/giraffe-m.jpg', alt: 'Giraffe reaching for leaves held out on a branch' }
    ]
  }
];
