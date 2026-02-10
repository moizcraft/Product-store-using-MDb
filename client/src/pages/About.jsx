import { motion } from 'framer-motion';
import { ShoppingBag, Users, Shield, TrendingUp } from 'lucide-react';

export default function About() {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const features = [
    {
      icon: ShoppingBag,
      title: "Quality Products",
      description: "We curate a diverse selection of premium fashion items, from elegant accessories to trendy footwear, ensuring quality in every purchase."
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Our platform connects buyers with trusted sellers, fostering a vibrant marketplace built on transparency and mutual respect."
    },
    {
      icon: Shield,
      title: "Secure Shopping",
      description: "Your security is our priority. We implement industry-standard practices to protect your data and ensure safe transactions."
    },
    {
      icon: TrendingUp,
      title: "Growing Together",
      description: "We support sellers in building their businesses while providing customers with an ever-expanding catalog of fashion choices."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-5xl font-bold mb-6">About VibeWear</h1>
            <p className="text-xl text-white/90 leading-relaxed">
              Your destination for discovering unique fashion and connecting with passionate sellers.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            className="space-y-12"
          >
            {/* Who We Are */}
            <motion.div variants={fadeInUp} className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Who We Are</h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                VibeWear is an e-commerce platform dedicated to bringing together fashion enthusiasts and independent sellers. 
                We believe in creating a marketplace where quality meets style, and where every transaction builds lasting relationships.
              </p>
            </motion.div>

            {/* Our Mission */}
            <motion.div variants={fadeInUp} className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                We strive to empower sellers by providing them with the tools and platform to reach a wider audience, 
                while offering customers a seamless shopping experience with access to unique, high-quality fashion items. 
                Our goal is to make online shopping simple, secure, and enjoyable for everyone.
              </p>
            </motion.div>

            {/* What We Offer */}
            <motion.div variants={fadeInUp} className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">What We Offer</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="flex gap-4"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                        <feature.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Our Values */}
            <motion.div variants={fadeInUp} className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed text-lg">
                <p>
                  <strong className="text-gray-900">Transparency:</strong> We believe in honest communication and clear policies that protect both buyers and sellers.
                </p>
                <p>
                  <strong className="text-gray-900">Quality:</strong> Every product listed on our platform meets our standards for authenticity and craftsmanship.
                </p>
                <p>
                  <strong className="text-gray-900">Innovation:</strong> We continuously improve our platform to provide better tools, features, and user experiences.
                </p>
                <p>
                  <strong className="text-gray-900">Community:</strong> We foster a supportive environment where sellers can thrive and customers can shop with confidence.
                </p>
              </div>
            </motion.div>

            {/* Join Us */}
            <motion.div
              variants={fadeInUp}
              className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-2xl p-8 text-white text-center shadow-lg"
            >
              <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
              <p className="text-lg text-white/90 mb-6 max-w-2xl mx-auto">
                Whether you're looking to discover unique fashion pieces or grow your business as a seller, 
                VibeWear is the platform for you. Join thousands of satisfied customers and successful sellers today.
              </p>
              <motion.a
                href="/signup"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block bg-white text-indigo-600 font-semibold px-8 py-3 rounded-full hover:bg-gray-100 transition-colors duration-300"
              >
                Get Started
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
