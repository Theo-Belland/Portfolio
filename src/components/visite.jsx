import { useEffect, useState } from "react";
import { doc, getDoc, setDoc, increment } from "firebase/firestore";
import { db } from "../firebase";

export default function CompteurVisites() {
  const [visites, setVisites] = useState(0);

  useEffect(() => {
    const handleVisite = async () => {
      try {
        const docRef = doc(db, "stats", "visites");

        // Anti-abus : un seul incrément par navigateur
        const alreadyVisited = localStorage.getItem("visited");

        if (!alreadyVisited) {
          // Crée le document si inexistant ou incrémente le champ count
          await setDoc(docRef, { count: increment(1) }, { merge: true });
          localStorage.setItem("visited", "true");
        }

        // Récupère le nombre total de visites
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          setVisites(snap.data().count);
        } else {
          // Document inexistant (rare avec setDoc merge:true)
          setVisites(0);
        }
      } catch (error) {
        console.error("Erreur compteur :", error);
      }
    };

    handleVisite();
  }, []);

  return <p>Nombre de visites : {visites}</p>;
}
