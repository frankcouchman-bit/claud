export function updatePageSEO({ title, description, canonical, keywords = [] }) {
  // Update title
  document.title = title

  // Update or create meta tags
  updateMetaTag('name', 'description', description)
  updateMetaTag('name', 'keywords', keywords.join(', '))
  
  // Open Graph
  updateMetaTag('property', 'og:title', title)
  updateMetaTag('property', 'og:description', description)
  updateMetaTag('property', 'og:url', canonical || window.location.href)
  
  // Twitter Card
  updateMetaTag('name', 'twitter:title', title)
  updateMetaTag('name', 'twitter:description', description)
  
  // Canonical
  updateCanonical(canonical || window.location.href)
}

function updateMetaTag(attrName, attrValue, content) {
  let element = document.querySelector(`meta[${attrName}="${attrValue}"]`)
  
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attrName, attrValue)
    document.head.appendChild(element)
  }
  
  element.setAttribute('content', content)
}

function updateCanonical(url) {
  let link = document.querySelector('link[rel="canonical"]')
  
  if (!link) {
    link = document.createElement('link')
    link.setAttribute('rel', 'canonical')
    document.head.appendChild(link)
  }
  
  link.setAttribute('href', url)
}

export function addStructuredData(data) {
  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.text = JSON.stringify(data)
  document.head.appendChild(script)
}
