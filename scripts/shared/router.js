export function markActive(pageKey) {
  const link = document.querySelector(`[data-page="${pageKey}"]`)
  if (link) link.classList.add('active')
}
