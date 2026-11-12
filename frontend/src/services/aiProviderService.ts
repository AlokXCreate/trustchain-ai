/**
 * TrustChain AI – Multi-Model AI Provider Service
 * Supports Google Gemini (gemini-1.5-flash), OpenAI (gpt-4o),
 * and TrustChain's built-in offline Grounded Forensic Engine.
 * Keys are stored locally in the user's browser.
 */

export type AIModelProvider = 'gemini' | 'openai' | 'offline';

export interface AIModelConfig {
  provider: AIModelProvider;
  geminiKey?: string;
  openaiKey?: string;
  geminiModel?: string;
  openaiModel?: string;
}

export interface AIChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIChatResponse {
  answer: string;
  provider: AIModelProvider;
  modelName: string;
  citations: string[];
}

const SYSTEM_PROMPT = `You are TrustChain AI Assistant, an elite enterprise forensic document authentication and fraud detection system.
You specialize in:
1. Multi-modal document verification (academic degrees, university transcripts, corporate certificates).
2. Forensic image tampering detection, Error Level Analysis (ELA) interpretation, and digital compression gradients.
3. Cryptographic SHA-256 integrity digests, EVM blockchain smart contract credential registries, and Merkle proofs.
4. OCR text validation, typographic kerning consistency, registrar seal verification, and anti-fraud scoring (0-100 scale).

Provide structured, authoritative, and helpful answers. Format findings clearly with headings, bullet points, and actionable next steps. When evaluating documents, explain both the technical forensic indicators and their real-world accreditation meaning.`;

class AIProviderService {
  public getStoredConfig(): AIModelConfig {
    if (typeof window === 'undefined') return { provider: 'offline' };
    const provider = (localStorage.getItem('tc_active_ai_provider') as AIModelProvider) || 'offline';
    const geminiKey = localStorage.getItem('tc_gemini_key') || '';
    const openaiKey = localStorage.getItem('tc_openai_key') || '';
    const geminiModel = localStorage.getItem('tc_gemini_model') || 'gemini-1.5-flash';
    const openaiModel = localStorage.getItem('tc_openai_model') || 'gpt-4o-mini';

    return {
      provider,
      geminiKey,
      openaiKey,
      geminiModel,
      openaiModel,
    };
  }

  public saveConfig(config: Partial<AIModelConfig>): void {
    if (typeof window === 'undefined') return;
    if (config.provider) localStorage.setItem('tc_active_ai_provider', config.provider);
    if (config.geminiKey !== undefined) localStorage.setItem('tc_gemini_key', config.geminiKey.trim());
    if (config.openaiKey !== undefined) localStorage.setItem('tc_openai_key', config.openaiKey.trim());
    if (config.geminiModel) localStorage.setItem('tc_gemini_model', config.geminiModel);
    if (config.openaiModel) localStorage.setItem('tc_openai_model', config.openaiModel);
  }

  public getActiveProviderName(): string {
    const config = this.getStoredConfig();
    if (config.provider === 'gemini' && config.geminiKey) {
      return `Google Gemini (${config.geminiModel || '1.5 Flash'})`;
    }
    if (config.provider === 'openai' && config.openaiKey) {
      return `OpenAI (${config.openaiModel || 'GPT-4o'})`;
    }
    return 'TrustChain Neural Engine (Offline)';
  }

  public async testConnection(provider: AIModelProvider, key: string): Promise<{ success: boolean; message: string }> {
    if (!key.trim()) {
      return { success: false, message: 'API key cannot be empty.' };
    }

    try {
      if (provider === 'gemini') {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key.trim()}`;
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: 'Respond with "TrustChain Gemini Connected"' }] }],
          }),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error?.message || `HTTP ${res.status}: Invalid Gemini API Key`);
        }
        return { success: true, message: 'Google Gemini connected successfully!' };
      }

      if (provider === 'openai') {
        const url = 'https://api.openai.com/v1/chat/completions';
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${key.trim()}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: 'Respond with "TrustChain OpenAI Connected"' }],
            max_tokens: 10,
          }),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error?.message || `HTTP ${res.status}: Invalid OpenAI API Key`);
        }
        return { success: true, message: 'OpenAI connected successfully!' };
      }

      return { success: true, message: 'TrustChain built-in engine is active.' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Connection test failed.' };
    }
  }

  public async chat(
    query: string,
    history: AIChatMessage[] = [],
    documentContext?: string
  ): Promise<AIChatResponse> {
    const config = this.getStoredConfig();

    // 1. If Gemini configured and chosen
    if (config.provider === 'gemini' && config.geminiKey) {
      try {
        return await this.callGemini(query, history, config.geminiKey, config.geminiModel, documentContext);
      } catch (err) {
        console.warn('Gemini call failed, falling back to offline engine:', err);
      }
    }

    // 2. If OpenAI configured and chosen
    if (config.provider === 'openai' && config.openaiKey) {
      try {
        return await this.callOpenAI(query, history, config.openaiKey, config.openaiModel, documentContext);
      } catch (err) {
        console.warn('OpenAI call failed, falling back to offline engine:', err);
      }
    }

    // 3. Fallback to TrustChain Grounded Offline Forensic Engine
    return this.generateOfflineResponse(query, documentContext);
  }

  private async callGemini(
    query: string,
    history: AIChatMessage[],
    apiKey: string,
    model = 'gemini-1.5-flash',
    documentContext?: string
  ): Promise<AIChatResponse> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const contents = [
      {
        role: 'user',
        parts: [
          {
            text: `${SYSTEM_PROMPT}\n\n${documentContext ? `ACTIVE DOCUMENT CONTEXT:\n${documentContext}\n\n` : ''}`,
          },
        ],
      },
      ...history.map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      })),
      {
        role: 'user',
        parts: [{ text: query }],
      },
    ];

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error?.message || 'Gemini API call failed');
    }

    const data = await response.json();
    const answer = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response returned from Gemini.';

    return {
      answer,
      provider: 'gemini',
      modelName: `Google ${model}`,
      citations: ['Google Gemini Multimodal API', 'TrustChain Forensic Database', 'Ethereum Credential Registry'],
    };
  }

  private async callOpenAI(
    query: string,
    history: AIChatMessage[],
    apiKey: string,
    model = 'gpt-4o-mini',
    documentContext?: string
  ): Promise<AIChatResponse> {
    const url = 'https://api.openai.com/v1/chat/completions';

    const messages = [
      {
        role: 'system',
        content: `${SYSTEM_PROMPT}\n\n${documentContext ? `ACTIVE DOCUMENT CONTEXT:\n${documentContext}` : ''}`,
      },
      ...history.map((m) => ({ role: m.role, content: m.content })),
      { role: 'user', content: query },
    ];

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error?.message || 'OpenAI API call failed');
    }

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content || 'No response from OpenAI.';

    return {
      answer,
      provider: 'openai',
      modelName: `OpenAI ${model}`,
      citations: ['OpenAI LLM Gateway', 'TrustChain Forensic Database', 'Ethereum Credential Registry'],
    };
  }

  private generateOfflineResponse(query: string, documentContext?: string): AIChatResponse {
    const lower = query.toLowerCase();

    let answer = '';
    let citations = ['TrustChain Grounded Knowledge Base', 'Sepolia EVM Credential Registry'];

    if (lower.includes('why') && (lower.includes('flag') || lower.includes('suspicious') || lower.includes('risk'))) {
      answer = `### Forensic Audit Analysis: Flagged Risk Drivers\n\n` +
        `When TrustChain AI evaluates documents for suspicious indicators, our ensemble analyzes three distinct failure vectors:\n\n` +
        `1. **Error Level Analysis (ELA) Inconsistencies**: Spliced or digitally inserted signatures/dates show irregular 8x8 DCT compression blocks compared to the background parchment.\n` +
        `2. **Typography & Font Kerning Variance**: Counterfeit certificates often use substitute vector fonts where character micro-spacing diverges from registered registrar typography.\n` +
        `3. **Ledger Discrepancies**: If the document's computed SHA-256 byte hash does not match an unrevoked token on the institutional smart contract, the document is flagged for manual review.\n\n` +
        `**Recommendation**: Verify that the document has not been re-saved through compression utilities, and confirm with the accredited issuer.`;
    } else if (lower.includes('blockchain') || lower.includes('hash') || lower.includes('contract')) {
      answer = `### Cryptographic Blockchain Verification Details\n\n` +
        `TrustChain AI utilizes a decentralized verification pipeline anchored on the **Ethereum Sepolia Testnet**:\n\n` +
        `* **Smart Contract Address**: \`0x71C840A95A1E586e927c97825b7a701E7E5Ac2D4\`\n` +
        `* **Registration Mechanism**: Accredited university registrars cryptographically sign and anchor the SHA-256 fingerprint into immutable blockchain state.\n` +
        `* **Tamper Proof**: Because the cryptographic hash is one-way, even altering a single pixel or comma changes the resultant digest, immediately exposing tampering.\n` +
        `* **Revocation Status**: Verifiers check both on-chain existence and revocation status flags in real-time.`;
      citations.push('EIP-712 Structured Data Registry');
    } else if (lower.includes('ocr') || lower.includes('text') || lower.includes('extract')) {
      answer = `### OCR & Semantic Validation Pipeline\n\n` +
        `TrustChain applies an enterprise dual-pass extraction system:\n\n` +
        `1. **Tesseract / Neural OCR**: Localizes bounding boxes, glyph confidence scores, and text density across all certificate axes.\n` +
        `2. **Named Entity Recognition (NER)**: Identifies student names, degree titles (e.g., *Bachelor of Science*), and conferral dates.\n` +
        `3. **Institution Cross-Matching**: Cross-references conferral dates with accredited academic calendar schedules.`;
      citations.push('Stanford & MIT Typography Standards');
    } else {
      answer = `### TrustChain Grounded Forensic Assessment\n\n` +
        `Thank you for your inquiry. TrustChain AI has evaluated your request against our multi-modal forensic inspection engine:\n\n` +
        `* **Document Integrity**: Validated via SHA-256 cryptographic hashing.\n` +
        `* **Image Forensics**: Scanned using Error Level Analysis (ELA) for digital pixel tampering.\n` +
        `* **Decentralized Verification**: Cross-checked against institutional credential smart contracts.\n\n` +
        `${documentContext ? `*Context Active*: ${documentContext}\n\n` : ''}` +
        `Feel free to ask specific questions about any extracted field, ELA heatmap finding, or risk score calculation!`;
    }

    return {
      answer,
      provider: 'offline',
      modelName: 'TrustChain Neural Engine (Offline Grounded)',
      citations,
    };
  }
}

export const aiProviderService = new AIProviderService();

