import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';
import SectionTitle from '../ui/SectionTitle';
import { Education } from '../../services/portfolioService';

interface EducationSectionProps {
  education: Education[];
}

const EducationSection: React.FC<EducationSectionProps> = ({ education }) => {
  return (
    <section id="education" className="py-20 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <SectionTitle 
          title="Education" 
          // subtitle="My academic background and qualifications"
        />
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {education.map((edu, index) => (
            <motion.div
              key={edu.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <GraduationCap className="text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{edu.degree}</h3>
                  <p className="text-text-secondary dark:text-text-secondary-dark mb-1">
                    {edu.institution}
                  </p>
                  <p className="text-sm text-text-secondary dark:text-text-secondary-dark mb-4">
                    {edu.from} - {edu.to}
                  </p>
                  <p className="text-text-secondary dark:text-text-secondary-dark">
                    {edu.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EducationSection;