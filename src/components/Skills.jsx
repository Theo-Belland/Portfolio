import React from "react";
import { FaHtml5, FaCss3Alt, FaJs, FaReact, FaNodeJs } from "react-icons/fa";
import { motion } from "framer-motion";
import "../Styles/skill.scss";

export default function Skills() {
  const skills = [
    { name: "HTML", icon: <FaHtml5 color="#e34c26" />, level: 90 },
    { name: "CSS", icon: <FaCss3Alt color="#264de4" />, level: 85 },
    { name: "JavaScript", icon: <FaJs color="#f0db4f" />, level: 80 },
    { name: "React", icon: <FaReact color="#61dafb" />, level: 75 },
    { name: "Node.js", icon: <FaNodeJs color="#68a063" />, level: 70 },
  ];

  // Diviser en 2 sections
  const mid = Math.ceil(skills.length / 2);
  const firstCol = skills.slice(0, mid);
  const secondCol = skills.slice(mid);

  const renderSkill = (skill, i) => (
    <div key={skill.name} className="skill-item">
      <motion.div
        className="skill-left"
        initial={{ y: 0 }}
        animate={{ y: [0, -8, 0] }}
        transition={{
          duration: 1.2,
          delay: i * 0.15,
          repeat: Infinity,
          repeatDelay: 2,
        }}
      >
        <div className="skill-icon">{skill.icon}</div>
        <span className="skill-name">{skill.name}</span>
      </motion.div>
      <div className="skill-bar">
        <div className="skill-progress" style={{ width: `${skill.level}%` }} />
      </div>
    </div>
  );

  return (
    <section className="skills" id="competences">
      <h2>Compétences</h2>
      <div className="skills-columns">
        <div className="skills-column">{firstCol.map(renderSkill)}</div>
        <div className="skills-column">{secondCol.map(renderSkill)}</div>
      </div>
    </section>
  );
}
