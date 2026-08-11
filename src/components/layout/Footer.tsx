import { site } from '../../content/site'

export default function Footer() {
  return (
    <footer className="border-t border-navy-lightest/60 py-8 text-center text-sm text-slate">
      <p>
        Built and designed by {site.name}. All rights reserved. &copy; {new Date().getFullYear()}
      </p>
    </footer>
  )
}
