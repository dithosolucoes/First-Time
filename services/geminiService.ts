import type { Citation } from '../types';

interface ChatResponse {
  text: string;
  citations: Citation[];
}

// O mock agora aceita os IDs das fontes selecionadas para simular uma resposta contextual
export const getChatResponse = async (prompt: string, selectedSourceIds: string[]): Promise<ChatResponse> => {
  console.log(`Sending prompt to mock Gemini about sources: ${selectedSourceIds.join(', ')}`);
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 800));

  const lowerCasePrompt = prompt.toLowerCase();
  const sourcesMention = selectedSourceIds.length > 0 ? `Com base nas suas ${selectedSourceIds.length} fontes selecionadas` : 'Como não há fontes selecionadas, usarei meu conhecimento geral';

  if (lowerCasePrompt.includes('resumir') || lowerCasePrompt.includes('sumarizar')) {
    return {
      text: `${sourcesMention}, o conceito principal é a utilização de uma arquitetura RAG (Retrieval-Augmented Generation) para garantir que as respostas sejam factualmente embasadas nos documentos do usuário. [1] Isso minimiza alucinações e aumenta a confiança no sistema. [2]`,
      citations: [{ sourceId: '1', citationNumber: 1 }, { sourceId: '2', citationNumber: 2 }]
    };
  }
  if (lowerCasePrompt.includes('rag')) {
    return {
      text: `RAG (Geração Aumentada por Recuperação) é uma arquitetura de IA que combina um modelo de linguagem com um mecanismo de recuperação de informação de uma base de conhecimento, como as fontes que você forneceu. [1] Isso garante que as respostas sejam precisas e rastreáveis. [2]`,
      citations: [{ sourceId: '1', citationNumber: 1 }, { sourceId: '2', citationNumber: 2 }]
    };
  }
  if (lowerCasePrompt.includes('olá') || lowerCasePrompt.includes('oi')) {
     return {
        text: `Olá! Sou seu assistente Eu Digital. Sobre o que vamos conversar hoje?`,
        citations: []
     };
  }
  return {
    text: `${sourcesMention}, uma análise sobre "${prompt}" revela que a arquitetura do sistema depende de um pipeline de processamento que inclui ingestão e "chunking" estratégico. [1] Cada resposta gerada é fundamentada nesse material. [2]`,
    citations: [{ sourceId: '1', citationNumber: 1 }, { sourceId: '2', citationNumber: 2 }]
  };
};

export const generateStudioContent = async (type: string, config: unknown): Promise<string> => {
    console.log(`Generating content for ${type} with config:`, config);
    await new Promise(resolve => setTimeout(resolve, 2500 + Math.random() * 1500));
    return `Conteúdo para ${type} gerado com sucesso! Aqui estão os resultados...`;
}
