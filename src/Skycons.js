// React wrapper for Skycons
export function setSkyconIcon(icon, canvas) {
  if (window.Skycons) {
    const skycons = new window.Skycons({ color: 'white' });
    const currentIcon = icon.replace(/-/g, '_').toUpperCase();
    skycons.set(canvas, window.Skycons[currentIcon]);
    skycons.play();
  }
}