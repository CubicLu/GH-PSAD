export const titleizeSlug = (slug, spacer = '_') => {
  const words = slug.split(spacer);

  for (let i = 0; i < words.length; i++) {
    let word = words[i];
    words[i] = word.charAt(0).toUpperCase() + word.slice(1);
  }

  return words.join(' ');
}
