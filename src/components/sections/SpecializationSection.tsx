import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import SectionTitle from '../ui/SectionTitle';

interface Specialization {
  _id: string;
  title: string;
  description: string;
  icon: string;
}

const SpecializationSection = () => {
  const [specializations, setSpecializations] = useState<Specialization[]>([]);

  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/specializations`);
        if (res.ok) {
          const data = await res.json();
          setSpecializations(data);
        } else {
          setSpecializations([]);
        }
      } catch (error) {
        console.error('Error fetching specializations:', error);
        setSpecializations([]);
      }
    };

    fetchSpecializations();
  }, []);

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <SectionTitle 
          title="Specializations" 
        />
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {specializations.map((spec, index) => (
            <motion.div
              key={spec._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                  <img src={spec.icon} alt={spec.title} className="w-8 h-8 object-contain" />
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
