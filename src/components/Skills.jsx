import React from "react";
import { FaHtml5, FaCss3Alt, FaJs, FaReact, FaNodeJs } from "react-icons/fa";
import { motion } from "framer-motion";
import "../Styles/skill.scss";

export default function Skills() {
  const skills = [
    { name: "HTML", icon: <FaHtml5 color="#e34c26" /> },
    { name: "CSS", icon: <FaCss3Alt color="#264de4" /> },
    { name: "JavaScript", icon: <FaJs color="#f0db4f" /> },
    { name: "React", icon: <FaReact color="#61dafb" /> },
    { name: "Node.js", icon: <FaNodeJs color="#68a063" /> },
  ];

  return (
    <section className="skills">
      <h2>Compétences</h2>
      <div className="skills-icons">
        {skills.map((skill, i) => (
          <motion.div
            key={skill.name}
            className="skill-icon"
            initial={{ y: 0 }}
            animate={{ y: [0, -8, 0] }}
            transition={{
              duration: 1.2,
              delay: i * 0.15,
              repeat: Infinity,
              repeatDelay: 2,
            }}
          >
            {skill.icon}
            <span>{skill.name}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
