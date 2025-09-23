/*
 * Lógica de la aplicación web del imperdible asistente eléctrico.
 *
 * Este script define un conjunto de preguntas frecuentes (FAQ) que
 * relacionan expresiones regulares con respuestas basadas en el
 * Reglamento Electrotécnico para Baja Tensión (REBT) y en algunas
 * normas UNE de aplicación. El usuario puede escribir su pregunta
 * y pulsar «Preguntar» o la tecla Entrar; el asistente buscará si
 * la pregunta coincide con alguna entrada y responderá. En caso de
 * no encontrar coincidencias, mostrará un mensaje genérico y
 * cambiará el avatar a estado confuso.
 */

document.addEventListener('DOMContentLoaded', () => {
  const avatarImg = document.getElementById('avatar');
  const dialogue = document.getElementById('dialogue');
  const dialogueContent = document.getElementById('dialogue-content');
  const yesBtn = document.getElementById('yes-btn');
  const noBtn = document.getElementById('no-btn');
  const questionInput = document.getElementById('question-input');
  const askBtn = document.getElementById('ask-btn');

  /**
   * Base de conocimiento: cada entrada incluye una expresión regular
   * para reconocer la pregunta y una respuesta en texto plano.
   */
  const knowledgeBase = [
    {
      pattern: /\b(que\s+es\s+el\s+rebt|que\s+es\s+el\s+reglamento|rebt|reglamento\s+electrotécnico)\b/i,
      answer:
        "El Reglamento Electrotécnico para Baja Tensión (REBT) establece las condiciones técnicas y garantías que deben reunir las instalaciones eléctricas conectadas a una fuente de suministro en los límites de baja tensión. Su finalidad es preservar la seguridad de las personas y los bienes, asegurar el funcionamiento normal de dichas instalaciones y contribuir a la fiabilidad técnica y a la eficiencia económica de la instalación."
    },
    {
      pattern: /\b(campo\s+de\s+aplicacion|ámbito\s+de\s+aplicación|aplicacion\s+del\s+rebt)\b/i,
      answer:
        "El REBT se aplica a las instalaciones que distribuyen energía, a las generadoras para consumo propio y a las receptoras, siempre dentro de los límites de baja tensión (≤1.000 V en corriente alterna o ≤1.500 V en corriente continua). Afecta a las nuevas instalaciones y a las modificaciones o ampliaciones de las existentes en la parte modificada. Se excluyen instalaciones específicas como las de minas, material de tracción, automóviles, navíos, aeronaves, sistemas de comunicación y usos militares, que se rigen por su propia normativa."
    },
    {
      pattern: /\b(instalacion\s+electrica|que\s+es\s+una\s+instalacion)\b/i,
      answer:
        "Una instalación eléctrica es el conjunto de aparatos y circuitos asociados con un fin determinado: producción, conversión, transformación, transmisión, distribución o utilización de la energía eléctrica."
    },
    {
      pattern: /\b(contacto\s+directo)\b/i,
      answer:
        "Se denomina contacto directo al contacto de personas o animales con partes activas de los materiales y equipos eléctricos."
    },
    {
      pattern: /\b(contacto\s+indirecto)\b/i,
      answer:
        "Se denomina contacto indirecto al contacto de personas o animales con partes que se han puesto bajo tensión como consecuencia de un fallo de aislamiento."
    },
    {
      pattern: /\b(itc|instrucciones\s+técnicas\s+complementarias|itc-bt)\b/i,
      answer:
        "Las Instrucciones Técnicas Complementarias (ITC‑BT) son documentos que complementan, modifican o sustituyen las prescripciones generales del REBT para aspectos concretos de las instalaciones. Están numeradas de la BT‑01 a la BT‑52 y desarrollan cuestiones específicas como la documentación, las verificaciones, las redes aéreas y subterráneas, la puesta a tierra, las instalaciones en locales especiales, etc."
    },
    {
      pattern: /\b(une\s+202009|norma\s+une\s+202009)\b/i,
      answer:
        "La serie UNE 202009 recoge guías y metodologías para la verificación e inspección de las instalaciones eléctricas de baja tensión. Cada parte de la serie aborda un tipo de instalación (viviendas, locales de pública concurrencia, garajes, quirófanos, etc.) y proporciona criterios para comprobar el cumplimiento del REBT y garantizar la seguridad y el mantenimiento preventivo."
    },
    {
      pattern: /\b(proteccion(?:es)?\s+contra\s+contactos|como\s+evitar\s+contacto\s+directo|como\s+evitar\s+contacto\s+indirecto)\b/i,
      answer:
        "Para evitar los contactos directos se recurre al aislamiento de las partes activas, el uso de barreras o envolventes y el mantenimiento de distancias de seguridad. Para proteger contra contactos indirectos, todas las masas metálicas deben conectarse a tierra y deben instalarse dispositivos de corte automático como interruptores diferenciales de alta sensibilidad (≤30 mA) que desconecten la alimentación al detectar una fuga."
    }
  ];

  /**
   * Busca una respuesta en la base de conocimiento. Si no hay coincidencia
   * devuelve null.
   *
   * @param {string} question Texto de la pregunta en minúsculas.
   * @returns {string|null} Respuesta o null si no se encuentra.
   */
  function getAnswer(question) {
    for (const entry of knowledgeBase) {
      if (entry.pattern.test(question)) {
        return entry.answer;
      }
    }
    return null;
  }

  /**
   * Muestra el cuadro de diálogo con la respuesta y ajusta la imagen del
   * avatar según el contexto (normal, alerta o confuso). También
   * personaliza los textos de los botones.
   *
   * @param {string|null} answer La respuesta obtenida de la base de
   *  conocimiento o null si no se encuentra.
   */
  function respond(answer) {
    let text;
    if (!answer) {
      text =
        "Lo siento, no tengo información sobre esa pregunta. Por favor, consulta el Reglamento Electrotécnico para Baja Tensión (REBT) o las normas UNE correspondientes.";
      avatarImg.src = "assets/imperdible_confuso.png";
      yesBtn.textContent = "Entendido";
      noBtn.textContent = "Cerrar";
    } else {
      text = answer;
      // Si la respuesta menciona palabras clave asociadas a peligro o riesgo,
      // mostramos al avatar en modo alerta. Evitamos desencadenar alerta por
      // menciones neutras como "seguridad" en un contexto general.
      const lower = answer.toLowerCase();
      if (lower.includes("riesgo") || lower.includes("peligro") || lower.includes("problema")) {
        avatarImg.src = "assets/imperdible_alerta.png";
      } else {
        avatarImg.src = "assets/imperdible_normal.png";
      }
      yesBtn.textContent = "Gracias";
      noBtn.textContent = "Cerrar";
    }
    dialogueContent.textContent = text;
    dialogue.classList.remove('hidden');
  }

  // Acción al pulsar el botón de preguntar
  askBtn.addEventListener('click', () => {
    const q = questionInput.value.trim();
    if (q === "") return;
    const ans = getAnswer(q.toLowerCase());
    respond(ans);
  });

  // Permitir enviar la pregunta con Enter
  questionInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      askBtn.click();
    }
  });

  // Cerrar el cuadro de diálogo y restaurar estado normal del avatar
  function closeDialogue() {
    dialogue.classList.add('hidden');
    avatarImg.src = "assets/imperdible_normal.png";
    // vaciar la entrada? no necesariamente
  }

  yesBtn.addEventListener('click', closeDialogue);
  noBtn.addEventListener('click', closeDialogue);
});