import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';
import SectionTitle from '../ui/SectionTitle';
import { Experience } from '../../services/portfolioService';

interface ExperienceSectionProps {
  experiences: Experience[];
}

const ExperienceSection: React.FC<ExperienceSectionProps> = ({ experiences }) => {
  return (
    <section id="experience" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <SectionTitle 
          title="Professional Experience" 
          // subtitle="My journey in the tech industry"
        />
        
        <div className="max-w-4xl mx-auto">
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative pl-8 pb-12 border-l-2 border-primary last:pb-0"
            >
              <div className="absolute left-[-9px] top-0 w-4 h-4 bg-primary rounded-full"></div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <Briefcase className="text-primary" />
                  <div>
                    <h3 className="text-xl font-bold">{exp.title}</h3>
                    <p className="text-text-secondary dark:text-text-secondary-dark">
                      {exp.company} • {exp.location}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-text-secondary dark:text-text-secondary-dark mb-4">
                  {exp.from} - {exp.current ? 'Present' : exp.to}
                </p>
                <p className="text-text-secondary dark:text-text-secondary-dark">
                  {exp.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;