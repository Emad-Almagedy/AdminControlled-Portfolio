import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import SectionTitle from '../ui/SectionTitle';
import { Certificate, getCertificates } from '../../services/portfolioService';
import { ExternalLink } from 'lucide-react';

const CertificatesSection: React.FC = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);

  useEffect(() => {
    const fetchCertificates = async () => {
      const data = await getCertificates();
      setCertificates(data);
    };
    fetchCertificates();
  }, []);

  return (
    <section id="certificates" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <SectionTitle title="Certificates" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {certificates.map((certificate, index) => (
            <motion.div
              key={certificate.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              style={{ minHeight: '220px' }}
            >
              <div className="flex justify-end">
                {certificate.image && (
                  <img
                    src={certificate.image}
                    alt={`${certificate.issuer} logo`}
                    className="w-16 h-16 object-contain bg-white p-1 rounded"
                  />
                )}
              </div>
              <div className="flex-grow mt-4">
                <h3 className="text-lg font-semibold mb-2">{certificate.title}</h3>
                <p className="text-sm text-text-secondary dark:text-text-secondary-dark">
                  {certificate.issuer}
                </p>
              </div>
              {certificate.url && (
                <a
                  href={certificate.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center justify-center px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
                >
                  <ExternalLink size={16} className="mr-2" />
                  View Certificate
                </a>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CertificatesSection;
