import React from "react";
import Hero from "../components/Hero";
import Skills from "../components/Skills";
import Projects from "../components/Projects";
import ContactForm from "../components/ContactForm";
import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Skills />
      <Projects />
      <ContactForm />
    </main>
  );
}
