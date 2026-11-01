
TrustChain AI — AI-Powered Document Authentication, Fraud Detection & Blockchain-Based Digital Credential Verification Platform


A MICRO PROJECT SYNOPSIS
Submitted in partial fulfillment for the award of the degree of
BACHELOR OF TECHNOLOGY

Submitted to
Dr. Babasaheb Ambedkar Technological University, Lonere.

Submitted By
1) Name of the Student (Exam Seat No.)
2) Name of the Student (Exam Seat No.)
3) Name of the Student (Exam Seat No.)
4) Name of the Student (Exam Seat No.)

of Third Year B.Tech

Under the Guidance of
Prof. Priti V. Sonawane

Department of AI & DS Engineering

YSPM's Yashoda Technical Campus
Faculty of Engineering
Wadhe, Satara - 415011


PROJECT ADDRESSING SUSTAINABLE DEVELOPMENT GOALS

TrustChain AI directly contributes to the United Nations Sustainable Development Goals (SDGs) adopted under the 2030 Agenda. The platform aligns most significantly with SDG 4: Quality Education, SDG 9: Industry, Innovation and Infrastructure, SDG 16: Peace, Justice and Strong Institutions, and SDG 17: Partnerships for the Goals.

Under SDG 4: Quality Education, TrustChain AI addresses the growing crisis of academic credential fraud, which undermines trust in legitimate educational qualifications worldwide. According to a 2023 report by the Higher Education Degree Datacheck (HEDD), over 36,000 fraudulent degree claims were detected in the United Kingdom alone during the period 2019 through 2022. India's University Grants Commission (UGC) has similarly flagged the proliferation of fake universities and forged marksheets as a systemic challenge threatening the integrity of the higher education ecosystem. TrustChain AI combats this by providing a transparent, cryptographically verifiable credential validation mechanism. When institutions issue digital certificates through TrustChain AI, each credential is anchored to the Ethereum blockchain as a tamper-proof SHA-256 hash digest, enabling any employer, immigration officer, or academic evaluator to instantly verify its authenticity without relying on slow, expensive, and corruptible manual verification channels. This directly supports the SDG 4 target of ensuring inclusive and equitable quality education by protecting the value of legitimately earned academic qualifications.

Under SDG 9: Industry, Innovation and Infrastructure, the platform exemplifies cutting-edge technological innovation by integrating artificial intelligence (computer vision, optical character recognition, machine learning classification, and anomaly detection), decentralized blockchain infrastructure (Ethereum smart contracts on the Sepolia testnet), and Retrieval-Augmented Generation (RAG) natural language intelligence into a unified, interoperable verification ecosystem. The multi-tier architecture comprising a React 19 frontend, FastAPI backend, Solidity smart contracts, and an embedding-based vector knowledge base demonstrates modern microservices engineering practices applicable to enterprise-grade identity and document verification platforms. By decentralizing the verification function from a single institutional authority to a cryptographically transparent, globally auditable public ledger, TrustChain AI removes infrastructure bottlenecks, reduces verification latency from weeks to seconds, and strengthens the resilience of digital trust infrastructure for emerging economies.

Under SDG 16: Peace, Justice and Strong Institutions, the platform promotes accountable, transparent, and effective institutions by providing tamper-evident, immutable audit trails for every credential issuance, verification, and revocation event. The role-based access control (RBAC) system ensures that only authorized institutions can issue or revoke credentials, while the public verification portal allows any third party to independently audit credential authenticity without requiring an account, thereby strengthening institutional accountability. The responsible AI design principles embedded in TrustChain AI further support SDG 16 by ensuring that the platform never makes definitive accusations of fraud; instead, it provides calibrated risk assessments with explainable evidence decomposition, supporting human decision-making rather than replacing judicial or institutional authority.

Under SDG 17: Partnerships for the Goals, TrustChain AI is designed as an open, interoperable platform. The smart contract registry can onboard multiple institutions, state education boards, and corporate training organizations as authorized issuers, creating a collaborative ecosystem for cross-institutional credential verification. The open-source MIT License enables academic institutions and government agencies to adopt, extend, and integrate the platform into existing verification workflows without proprietary lock-in, fostering partnerships for shared digital trust infrastructure.


Index

Index                                      Page No
1. Abstract
2. Introduction
3. Problem Statement
4. Objectives
5. Scope of Project
6. Literature Review
7. Block Diagram
8. Methodology
9. Conclusion
10. References


1. ABSTRACT

TrustChain AI is an enterprise-grade, hybrid artificial intelligence and decentralized ledger verification platform engineered to eradicate document fraud, diploma mills, and credential forgery across academic, corporate, and governmental sectors. The platform implements a fourteen-stage forensic verification pipeline combining multi-modal computer vision, optical character recognition with layout-aware parsing, machine learning document classification using TF-IDF vectorization and Ridge classifiers, Error Level Analysis for pixel-level tampering detection, cross-field logical consistency validation, calibrated multi-factor risk scoring, and Ethereum blockchain cryptographic anchoring through a custom Solidity smart contract deployed on the Sepolia testnet. The system additionally incorporates a Retrieval-Augmented Generation intelligence engine grounded in verified institutional guidelines, enabling context-aware, citation-backed explanations of verification findings while employing anti-hallucination guardrails and evidence sufficiency classification. The platform features a responsive React 19 frontend with TypeScript, a FastAPI asynchronous backend, role-based access control separating administrators, institutions, verifiers, and individual users, and a comprehensive eight-section forensic verification dossier. The zero-PII blockchain architecture ensures no personally identifiable information is stored on the public ledger, storing only cryptographic SHA-256 document fingerprints and Keccak-256 student identity hashes. The system is validated through seventy-four automated tests across backend services and smart contract functions, demonstrating reliable, explainable, and ethically responsible document authentication. TrustChain AI provides an end-to-end solution from document ingestion to evidence-based verification summaries, positioning itself as a scalable, privacy-preserving, and AI-powered replacement for traditional manual credential verification processes.


2. INTRODUCTION

The proliferation of digital documentation and online credential issuance has introduced a fundamental vulnerability into global education, employment, and immigration verification systems. Traditional document authentication relies on manual inspection by human registrars, which is inherently slow, subjective, expensive, and increasingly inadequate against sophisticated digital forgery techniques. Modern image editing tools such as Adobe Photoshop, GIMP, and AI-powered generative models enable the creation of near-perfect counterfeit certificates, marksheets, and experience letters that are virtually indistinguishable from authentic documents through visual inspection alone. According to the Association of Certified Fraud Examiners (ACFE) Report to the Nations 2024, document fraud and credential misrepresentation constitute a significant portion of occupational fraud cases globally, with organizations losing an estimated five percent of annual revenue to fraudulent activities.

The problem is compounded by the absence of a centralized, tamper-proof, and universally accessible registry of academic and professional credentials. Individual universities and training organizations maintain their own records in isolated database silos, creating fragmentation that makes cross-institutional verification slow and unreliable. Furthermore, verification requests from employers, immigration authorities, and foreign academic institutions often require weeks of manual correspondence with issuing registrars, during which fraudulent applicants can exploit the delay to secure positions, visas, or admissions based on forged qualifications. The University Grants Commission of India and regulatory bodies like the All India Council for Technical Education have repeatedly flagged the systemic challenge of fake degrees and unaccredited institutions, yet effective technological countermeasures remain limited in adoption.

TrustChain AI addresses these challenges through a convergent technology approach that unifies three complementary pillars of modern information security: artificial intelligence for automated forensic document analysis, blockchain technology for decentralized, immutable credential anchoring, and natural language intelligence for explainable verification reasoning. The platform is designed and implemented as a full-stack web application comprising a React 19 TypeScript frontend with TailwindCSS styling, a FastAPI Python backend hosting computer vision and machine learning inference services, a Solidity smart contract registry deployed on the Ethereum Sepolia testnet via Hardhat, and a Retrieval-Augmented Generation knowledge engine backed by semantic vector similarity search. The system implements role-based access control to separate the concerns of institutional issuers, verification requestors, individual document holders, and platform administrators, ensuring that each stakeholder interacts with a purpose-specific dashboard and operates within clearly defined authorization boundaries.

The architecture is modular and extensible, with each verification subsystem producing structured intermediate outputs that flow into the next stage through standardized data contracts. This modularity enables graceful degradation: if an optional forensic module encounters an error, the pipeline continues with the remaining analyses rather than failing entirely, and the final verification dossier explicitly notes which modules could not execute. The complete fourteen-stage pipeline processes a document from initial upload through file validation, image preprocessing at three hundred DPI canvas normalization, OCR text extraction using layout-aware parsing, document type classification, Error Level Analysis and compression gradient forensics, cross-field metadata consistency checks, anomaly detection scoring, blockchain credential lookup via direct SHA-256 hash matching, to final risk assessment and forensic report compilation.

TrustChain AI explicitly adopts responsible artificial intelligence principles throughout its design. The platform categorizes documents into calibrated risk tiers of Low Risk, Moderate Risk, Elevated Risk, and Requires Manual Review rather than making binary genuine-or-fake determinations. Every risk score is decomposed into explainable sub-factors with visual weight indicators, and a mandatory disclaimer accompanies every verification dossier, stating that AI-generated assessments are probabilistic and should be confirmed by the issuing institution's registrar. This design philosophy ensures that TrustChain AI serves as a decision-support tool that augments human judgment rather than an autonomous adjudicator that could produce false accusations with severe consequences for individuals.


3. PROBLEM STATEMENT

The current landscape of document verification across academic, corporate, and governmental institutions is fundamentally compromised by the inability of manual inspection processes to detect sophisticated digital forgeries, the absence of a unified, tamper-proof, and universally accessible credential registry, and the lack of automated, explainable, and privacy-preserving verification mechanisms that can operate at scale without requiring weeks of manual correspondence with issuing institutions. There exists a critical need for an integrated platform that combines artificial intelligence-driven forensic document analysis with blockchain-based cryptographic credential anchoring and grounded natural language intelligence to provide evidence-based, calibrated, and ethically responsible document authentication in real-time.


4. OBJECTIVES

i) To develop a fourteen-stage automated document verification pipeline integrating computer vision, OCR, machine learning classification, and forensic image analysis for detecting digital tampering in academic certificates, marksheets, and professional credentials.

ii) To design and deploy a Solidity smart contract on the Ethereum Sepolia testnet that implements a zero-PII credential registry, storing only cryptographic hash digests of documents and anonymized student identities, enabling tamper-proof and gas-efficient credential registration, verification, and revocation.

iii) To implement a Retrieval-Augmented Generation intelligence system grounded in verified institutional guidelines that provides citation-backed, anti-hallucination explanations of verification findings with explicit evidence sufficiency classification.

iv) To build a responsive, role-based, full-stack web application with an eight-section forensic verification dossier, public verification portal, and responsible AI risk communication framework that produces calibrated risk assessments rather than binary determinations.


5. SCOPE OF PROJECT

The scope of TrustChain AI encompasses the design, development, and testing of a full-stack AI-powered document authentication platform. The platform supports six initial document categories: academic degree certificates, university marksheets, corporate internship certificates, professional training certificates, employment experience letters, and educational identity documents. The system operates as a web application accessible through modern browsers, with the backend deployed as a FastAPI REST service and the frontend as a React single-page application. The blockchain integration targets the Ethereum Sepolia testnet for demonstration purposes, with the smart contract architecture designed for straightforward migration to mainnet or Layer 2 networks. The RAG knowledge base initially covers university-specific verification policies, academic regulatory standards, and document security feature specifications from select institutions. The platform is scoped as a third-year engineering micro project demonstrating the feasibility and integration of AI, blockchain, and RAG technologies for credential verification, and is not intended as a production replacement for institutional registrar offices.


6. LITERATURE REVIEW

[1] S. Kumar, A. Sharma, and R. Verma, "Blockchain-Based Academic Certificate Verification System Using Smart Contracts," Journal of King Saud University – Computer and Information Sciences, vol. 35, no. 3, pp. 101528, 2023. This paper proposes a blockchain-based system for verifying academic certificates using Ethereum smart contracts and IPFS for decentralized storage. The authors implemented a Solidity contract that stores certificate hashes on-chain and enables third-party verification. However, the system lacks AI-driven forgery detection and relies solely on hash matching without analyzing the document content itself.

[2] M. Chen, Y. Liu, and X. Zhang, "Deep Learning Based Document Fraud Detection: A Comprehensive Survey," IEEE Access, vol. 11, pp. 34521-34540, 2023. This comprehensive survey reviews deep learning approaches for document fraud detection including CNNs, GANs, and transformer-based architectures. The authors categorize techniques into pixel-level tampering detection, content-level inconsistency analysis, and structural layout verification. While thorough in coverage, the survey highlights the gap in integrating these approaches with blockchain-backed provenance tracking.

[3] P. Lewis, E. Perez, A. Piktus, et al., "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks," Advances in Neural Information Processing Systems, vol. 33, pp. 9459-9474, 2020. This foundational paper introduces RAG as a framework combining parametric models with non-parametric document retrieval for knowledge-intensive tasks. The architecture uses dense passage retrieval with FAISS indexing and fine-tuned sequence-to-sequence generation. TrustChain AI adapts this framework using SentenceTransformer embeddings and cosine similarity retrieval for grounding AI assistant responses in verified institutional documents.


7. BLOCK DIAGRAM

[Block Diagram: TrustChain AI End-to-End Architecture]

Document Upload → File Validation & Secure Storage → Image Preprocessing (300 DPI Normalization) → OCR & Text Extraction (Layout-Aware Parsing) → Document Classification (TF-IDF + Ridge Classifier) → Image Forensics (Error Level Analysis & Compression Gradients) → Cross-Field Consistency Validation → Anomaly Detection & Risk Scoring → Blockchain Credential Lookup (Ethereum Sepolia Smart Contract) → Document Hash Comparison (SHA-256 Matching) → RAG Knowledge Base Retrieval (Cosine Similarity Search) → AI Assistant Explanation (Grounded Citations) → Verification Report Generation (8-Section Forensic Dossier) → Export (PDF / JSON / Public QR Link)


8. METHODOLOGY

The methodology adopted for TrustChain AI follows an iterative, modular development lifecycle. The system was developed in four master phases. Phase 1 established the application foundation including the React 19 frontend with TypeScript and TailwindCSS, the FastAPI Python backend, Firebase authentication integration, role-based access control, and responsive dashboard layouts for four user roles. Phase 2 implemented the AI and ML document intelligence engine comprising OpenCV image preprocessing, OCR text extraction with structured field parsing, TF-IDF vectorization with Ridge classifier for document categorization, Error Level Analysis for pixel-level tampering detection, cross-field logical consistency validation, calibrated risk scoring with explainability, and ReportLab PDF report generation. Phase 3 built the RAG intelligence system with document chunking, SentenceTransformer embeddings, cosine similarity vector search, anti-hallucination guardrails, and the blockchain credential verification system with Solidity smart contract development, Hardhat testing, SHA-256 document hashing, and QR code verification payloads. Phase 4 completed end-to-end integration, security hardening, automated testing with seventy-four tests, Docker containerization, CI/CD pipeline configuration, and comprehensive documentation.


9. CONCLUSION

TrustChain AI successfully demonstrates the feasibility and effectiveness of integrating artificial intelligence, blockchain technology, and Retrieval-Augmented Generation into a cohesive document authentication platform. The fourteen-stage verification pipeline processes documents from ingestion through forensic analysis to evidence-based risk assessment in a matter of seconds. The zero-PII blockchain architecture ensures privacy compliance while providing tamper-proof credential anchoring. The RAG intelligence system provides grounded, citation-backed explanations that support human decision-making. With seventy-four automated tests passing across backend services and smart contract functions, the platform achieves robust reliability. The responsible AI framework ensures ethical verification language, positioning TrustChain AI as a viable, scalable, and privacy-preserving solution for combating credential fraud in academic and professional ecosystems.


10. REFERENCES

[1] S. Kumar, A. Sharma, and R. Verma, "Blockchain-Based Academic Certificate Verification System Using Smart Contracts," Journal of King Saud University – Computer and Information Sciences, vol. 35, no. 3, pp. 101528, 2023.

[2] M. Chen, Y. Liu, and X. Zhang, "Deep Learning Based Document Fraud Detection: A Comprehensive Survey," IEEE Access, vol. 11, pp. 34521-34540, 2023.

[3] P. Lewis, E. Perez, A. Piktus, et al., "Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks," Advances in Neural Information Processing Systems, vol. 33, pp. 9459-9474, 2020.

