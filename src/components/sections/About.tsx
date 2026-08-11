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
        className="grid gap-12 md:grid-cols-[1fr_240px]"
      >
        <div>
          {about.paragraphs.map((paragraph, i) => (
            <p key={i} className="mb-4 leading-relaxed text-slate">
              {paragraph}
            </p>
          ))}
          <p className="text-slate">Here are some technologies I have been working with:</p>
          <TechList items={about.techList} />
        </div>

        <div className="justify-self-center md:justify-self-end">
          <ImageWithFallback
            src={about.photo}
            alt="Foto de perfil"
            className="h-48 w-48 rounded-lg border-2 border-navy-lightest object-cover"
          />
        </div>
      </motion.div>
    </section>
  )
}
