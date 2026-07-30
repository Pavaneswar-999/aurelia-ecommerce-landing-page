import { redirect } from 'next/navigation'

// The deliverable is a pure HTML/CSS/JS + Bootstrap page located in /public.
// This route simply redirects the preview to the static landing page.
export default function Page() {
  redirect('/index.html')
}
