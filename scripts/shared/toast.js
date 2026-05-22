let container = null

function getContainer() {
  if (!container) {
    container = document.createElement('div')
    container.className = 'toast-container'
    container.setAttribute('aria-live', 'polite')
    container.setAttribute('aria-atomic', 'false')
    document.body.appendChild(container)
  }
  return container
}

export function toast(message, type = 'info') {
  const el = document.createElement('div')
  el.className = `toast toast--${type}`
  el.setAttribute('role', 'status')
  el.textContent = message
  getContainer().appendChild(el)

  setTimeout(() => {
    el.classList.add('removing')
    el.addEventListener('animationend', () => el.remove(), { once: true })
  }, 3500)
}
