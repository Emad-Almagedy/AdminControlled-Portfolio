import { motion } from 'framer-motion';
import { TechStack } from '../../services/portfolioService';

interface TechStackSectionProps {
  techStack: TechStack[];
}

const TechStackSection: React.FC<TechStackSectionProps> = ({ techStack }) => {
  return (
    <section id="tech-stack" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold pb-2 text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
          Languages & Tools
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {techStack.map((tech) => (
            <motion.div
              key={tech.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center space-y-3"
            >
              <img 
                src={tech.icon} 
                alt={tech.name}
                className="w-16 h-16 object-contain"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStackSection;
