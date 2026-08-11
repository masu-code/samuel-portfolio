import { motion } from 'framer-motion'
import SectionHeading from '../layout/SectionHeading'
import FeaturedProject from '../ui/FeaturedProject'
import ProjectCard from '../ui/ProjectCard'
import { featuredProjects, projects } from '../../content/projects'
import { site } from '../../content/site'
import { fadeInUp, staggerContainer } from '../../lib/animations'

export default function Software() {
  const githubUrl = site.social.find((link) => link.icon === 'github')?.url

  return (
    <section id="software" className="mx-auto max-w-6xl px-6 py-24">
      <SectionHeading
        title="software"
        action={githubUrl ? { label: 'View all projects', url: githubUrl } : undefined}
      />

      <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
        <FeaturedProject projects={featuredProjects} />
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {projects.map((project) => (
          <motion.div key={project.title} variants={fadeInUp}>
            <ProjectCard project={project} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
