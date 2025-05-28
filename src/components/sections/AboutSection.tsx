import { motion } from 'framer-motion';
import SectionTitle from '../ui/SectionTitle';
import { About } from '../../services/portfolioService';

interface AboutSectionProps {
  about: About;
}

const AboutSection: React.FC<AboutSectionProps> = ({ about }) => {
  return (
    <section id="about" className="relative py-20 bg-white dark:bg-gray-800 overflow-visible">
      <div className="container mx-auto px-4">
        <SectionTitle title="About Me" />

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Profile Image with Purple Glow */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="relative mx-auto w-60 sm:w-72 md:w-80 lg:w-96 aspect-square scale-[1.4]"
          >
            {/* ✨ Purple Glow Behind Image */}
             <div
              className="absolute inset-0 z-0 rounded-2xl blur-3xl"
              style={{
                backgroundColor: '#8b5cf6', // Purple
                opacity: 0.3,
                transform: 'scale(1.5)',
              }}
            ></div>

            {/* Image */}
            <div className="relative z-10 rounded-2xl overflow-hidden w-full h-full shadow-xl">
              <img
                src={about.profileImage}
                alt={about.fullName}
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
          </motion.div>

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold">{about.fullName}</h3>
            <p className="text-text-secondary dark:text-text-secondary-dark leading-relaxed">
              {about.bio}
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Location</h4>
                <p className="text-text-secondary dark:text-text-secondary-dark">{about.location}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Email</h4>
                <p className="text-text-secondary dark:text-text-secondary-dark">{about.email}</p>
              </div>
              {about.phone && (
                <div>
                  <h4 className="font-semibold mb-2">Phone</h4>
                  <p className="text-text-secondary dark:text-text-secondary-dark">{about.phone}</p>
                </div>
              )}
              {about.social?.website && (
                <div>
                  <h4 className="font-semibold mb-2">Website</h4>
                  <a
                    href={about.social.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80"
                  >
                    {about.social.website}
                  </a>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
