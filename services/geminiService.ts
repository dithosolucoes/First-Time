import { GoogleGenAI, Type } from "@google/genai";
import type { Citation, GeneratedContent, Source } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

interface ChatResponse {
  text: string;
  citations: Citation[];
}

const buildSourceContext = (sources: Source[]): string => {
    if (!sources || sources.length === 0) {
        return "";
    }
    return sources.map((source, index) => 
        `--- SOURCE ${index + 1}: ${source.name} ---\n${source.content}`
    ).join('\n\n');
};

export const getChatResponse = async (prompt: string, sources: Source[]): Promise<ChatResponse> => {
  const sourceContext = buildSourceContext(sources);
  
  const finalPrompt = `
    Você é 'Eu Digital', um assistente de pesquisa virtual. Sua tarefa é responder à pergunta do usuário baseando-se exclusivamente nas fontes fornecidas. Não utilize conhecimento externo. Ao usar informações de uma fonte, cite-a imediatamente após a frase com seu número entre colchetes, como [1]. Se as fontes não contiverem a resposta, diga "Com base nas fontes fornecidas, não consegui encontrar uma resposta para isso."

    ${sourceContext ? `FONTES:\n${sourceContext}` : 'Nenhuma fonte foi fornecida.'}

    PERGUNTA DO USUÁRIO:
    "${prompt}"
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: finalPrompt,
  });

  let responseText = response.text.trim();
  
  const citations: Citation[] = [];
  const citationRegex = /\[(\d+)\]/g;
  let match;
  while ((match = citationRegex.exec(responseText)) !== null) {
      const citationNumber = parseInt(match[1], 10);
      if (citationNumber > 0 && citationNumber <= sources.length) {
          const sourceId = sources[citationNumber - 1].id;
          if (!citations.some(c => c.citationNumber === citationNumber)) {
              citations.push({ sourceId, citationNumber });
          }
      }
  }

  return { text: responseText, citations };
};

export const generateStudioContent = async (
    config: any,
    sources: Source[]
): Promise<Partial<GeneratedContent>> => {
    
    const sourceContext = buildSourceContext(sources);
    let prompt = `FONTES:\n${sourceContext}\n\nTAREFA:\n`;
    let responseSchema: any = null;
    let title = 'Conteúdo Gerado';

    switch (config.type) {
        case 'report':
            title = `Relatório: ${config.format}`;
            prompt += `Gere um relatório no formato "${config.format}" com base na seguinte descrição: "${config.description}". Utilize as fontes fornecidas.`;
            break;

        case 'flashcards':
            title = `Cartões: ${config.theme}`;
            prompt += `Gere ${config.count} cartões de estudo sobre "${config.theme}" com dificuldade ${config.difficulty}, baseando-se nas fontes.`;
            responseSchema = {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        front: { type: Type.STRING, description: 'O termo ou pergunta na frente do cartão.' },
                        back: { type: Type.STRING, description: 'A definição ou resposta no verso do cartão.' },
                    }
                }
            };
            break;

        case 'test':
            title = `Teste: ${config.theme}`;
            prompt += `Gere um teste com ${config.count} questões sobre "${config.theme}" com dificuldade ${config.difficulty}, baseando-se nas fontes. Inclua 3 opções de resposta e indique a correta.`;
            responseSchema = {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        question: { type: Type.STRING },
                        options: { type: Type.ARRAY, items: { type: Type.STRING } },
                        answer: { type: Type.STRING }
                    }
                }
            };
            break;
        
        case 'audio':
            title = config.title;
            prompt += `Você são dois apresentadores de um podcast. Crie um roteiro para um episódio no formato "${config.format}" com duração "${config.duration}". O foco principal é: "${config.focus}". Use um tom de conversa natural e baseie a discussão nas fontes fornecidas. O idioma é ${config.language}. Formate a saída como um roteiro claro, indicando as falas de cada apresentador (ex: [Apresentador 1]: ...).`;
            break;

        default:
            return {};
    }

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: responseSchema ? { responseMimeType: "application/json", responseSchema } : {}
    });

    let details: any = {};
    if (responseSchema) {
        try {
            details = JSON.parse(response.text);
        } catch (e) {
            console.error("Failed to parse JSON response:", e);
            details = { error: "Failed to parse content from AI." };
        }
    } else {
        details = { content: response.text };
    }

    // Para o áudio, ainda retornamos uma URL mock para o player do frontend funcionar
    if (config.type === 'audio') {
        return { 
            title, 
            details: { script: response.text }, 
            url: 'https://storage.googleapis.com/tts-temp-audio/8358c89a7428352667610098006f0073.mp3' 
        };
    }

    return { title, details };
};