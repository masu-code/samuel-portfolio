import { motion } from 'framer-motion'
import SectionHeading from '../layout/SectionHeading'
import TechList from '../ui/TechList'
import ImageWithFallback from '../ui/ImageWithFallback'
import { about } from '../../content/about'
import { fadeInUp } from '../../lib/animations'

export default function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-6 py-24">
      <SectionHeading title="about me" />

      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="grid gap-12 md:grid-cols-[1fr_300px]"
      >
        <div>
          <p className="mb-4 text-justify leading-relaxed text-slate">
            {about.introSegments.map((segment, i) => (
              <span key={i} className={segment.className}>
                {segment.text}
              </span>
            ))}
          </p>
          <p className="text-slate">Here are some technologies I have been working with:</p>
          <TechList items={about.techList} />
          <p className="mt-4 leading-relaxed text-slate">{about.closing}</p>
        </div>

        <div className="justify-self-center md:justify-self-end">
          <ImageWithFallback
            src={about.photo}
            alt="Foto de perfil"
            className="h-72 w-72 rounded-lg object-cover shadow-lg"
          />
        </div>
      </motion.div>
    </section>
  )
}
