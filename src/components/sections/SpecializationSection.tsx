import { motion } from 'framer-motion';
import { Brain, Eye, LineChart, Code, Database } from 'lucide-react';
import SectionTitle from '../ui/SectionTitle';

const specializations = [
  {
    icon: <Brain className="w-8 h-8" />,
    title: 'Machine Learning & AI',
    description: 'Predictive Modeling, Feature Engineering, Natural Language Processing, Generative AI, CNNs, LLMs, RAG.'
  },
  {
    icon: <Eye className="w-8 h-8" />,
    title: 'Computer Vision',
    description: 'Image processing, Deep learning-based generation (e.g., Stable Diffusion), OpenCV, TensorFlow, PyTorch.'
  },
  {
    icon: <LineChart className="w-8 h-8" />,
    title: 'Data Science & Visualization',
    description: 'Advanced Analytics, Data Processing, Matplotlib, Seaborn, Plotly, Interactive Dashboards.'
  },
  {
    icon: <Code className="w-8 h-8" />,
    title: 'Software & Web Development',
    description: 'Full-Stack Development, Python, JavaScript, HTML, CSS, C/C++, SQL, Visual Studio Code, PyCharm, React, Node.js.'
  },
  {
    icon: <Database className="w-8 h-8" />,
    title: 'Database & System Knowledge',
    description: 'Database Management, Networking Protocols, Operating Systems.'
  }
];

const SpecializationSection = () => {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <SectionTitle 
          title="Specializations" 
          // subtitle="Areas of Expertise"
        />
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {specializations.map((spec, index) => (
            <motion.div
              key={spec.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                  {spec.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{spec.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {spec.description}
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

export default SpecializationSection;