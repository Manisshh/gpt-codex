export async function loadCareerDataset(name) {
  const module = await import(`../../data/datasets/v1/${name}.json`);
  return module.default;
}
