# Oracle 345386 — Principal Core Infrastructure Engineer, AI Infrastructure
Research date: October 10, 2026

## Exact role, verified
The [Oracle careers posting](https://eeho.fa.us2.oraclecloud.com/hcmUI/CandidateExperience/en/sites/jobsearch/job/345386/) was read directly in the browser. It is a regular individual-contributor position in Nashville, Tennessee, posted September 14, 2026, requesting 6–10+ years. The advertised US base range is $114,600–$234,600, with possible additional compensation.

The team is Compute AI Infrastructure Bare Metal Provisioning. It owns automation from new AMD, Intel, Arm and NVIDIA platform shapes and hardware bring-up through customer-ready provisioning and firmware management. The posting names BMCs, NICs, SmartNICs, ILOMs, GPUs and custom firmware, and emphasizes distributed systems and Linux systems triage. It asks for C++ or Java, Python, data structures, networking, NoSQL persistence, troubleshooting, Terraform, and scalable services. Cross-team partners include Compute, Networking, Security, Data Center Engineering and Hardware Development. Multi-tenant virtualization is a plus. This is hardware lifecycle software engineering with distributed orchestration, rather than a model-training or application-agent position.

## Oracle and the product context
Oracle’s public AI infrastructure offering combines GPU compute, cluster networks, and storage. Its current product page advertises OCI Supercluster scale up to 131,072 GPUs, with supported configurations differing by hardware family. It describes bare metal GPU instances, high-bandwidth RDMA networking, local NVMe and multiple persistent storage choices. Those are product capabilities and marketing claims, not guarantees for every region, customer or shape. [Oracle AI infrastructure](https://www.oracle.com/ai-infrastructure/)

**Interpretation:** At this scale, successful server onboarding is a capacity problem as well as a correctness problem. A server that passes isolated component checks but fails fleet configuration or collective communication still delays useful customer capacity. The role’s interface with hardware and data-center teams makes readiness evidence and reproducible diagnostics especially relevant.

## Engineering research

### GPU readiness spans compute, network and storage
Oracle’s reference architecture joins bare metal GPU nodes through RoCE-based cluster networking, alongside local NVMe, block storage and parallel file-system choices. It also describes availability and fault domains, network segmentation, and monitoring. Its example scale is architecture-specific and smaller than the general product page; these should not be conflated. [Bare metal GPU reference architecture](https://docs.oracle.com/en/solutions/deploy-bare-metal-gpu-cluster-for-ai/index.html)

**Design implication:** A readiness gate should record device identity and enumeration, firmware compatibility, PCIe and storage health, network configuration, and workload-relevant validation. Local health does not establish rack-level readiness. Separate management traffic, customer networking and cluster fabric in the design narrative. The portfolio’s diagram represents orchestration conceptually; it is not an Oracle internal topology.

### Firmware changes require observable completion
DMTF’s Redfish specification models interoperable management resources and actions. The reviewed version discusses applying actions to groups and returning extended information when only some members succeed. A successful group response therefore must not be mistaken for every device completing its change. [Redfish specification, version 1.15.0](https://redfish.dmtf.org/schemas/DSP0266_1.15.0.html)

**Design implication:** Track each device’s prior and desired version, update progress, power state and post-update validation. Rate-limit changes by failure boundary, start with canaries, and keep explicit recovery procedures. Version rollback support depends on the device and vendor; a fleet orchestrator should not assume every update is reversible. Redfish is a management interface, not evidence of universal firmware behavior.

### Out-of-band management complements Linux triage
Oracle’s ILOM documentation offers separate guides for configuration and maintenance, security, SNMP/IPMI, system monitoring and diagnostics, and REST APIs. This organization reflects distinct concerns at the management-controller boundary and in the host operating system. [Oracle ILOM 5.0.x documentation](https://docs.oracle.com/en/servers/management/ilom/5.0.x/)

**Design implication:** Correlate controller events, device inventory and firmware state with host boot logs, kernel messages, PCIe errors and application symptoms. Preserve evidence before resetting hardware. A useful incident report should identify the failure boundary and explain why a remediation succeeded, rather than merely report that a reboot restored service.

### Provisioning needs durable state and idempotent execution
A fleet workflow can be interrupted between issuing a command, observing completion, and committing metadata. Distributed persistence must preserve ownership and progress while tolerating retries and worker failure. Raft provides a primary reference for replicated logs, leader election and safety, but the posting does not specify Oracle’s implementation. [Raft paper](https://raft.github.io/raft.pdf)

**Design implication:** Discuss operation identifiers, leases, reconciliation, timeout behavior and partially completed actions. Quarantine inconsistent servers before handing them to customers. Customer-ready should have a precise definition with security, configuration and validation evidence, plus an auditable transition.

### Linux PCIe recovery is a hierarchy problem
The Linux kernel AER guide distinguishes correctable, non-fatal and fatal PCIe errors. It explains that firmware must grant AER control to the OS, that root-port reporting differs from device-specific errors, and that driver callbacks coordinate recovery. Resets can affect devices beneath the relevant port. [Linux PCIe AER guide](https://docs.kernel.org/PCI/pcieaer-howto.html)

**Design implication:** Device health should be correlated with its PCIe topology, not just a GPU identifier. Capture requester information, counters, firmware ownership and driver recovery support. Do not treat every warning as a failed GPU or assume a reset has only one-device impact. These distinctions make the resume’s kernel, DMA, NVMe and PCIe triage relevant to fleet availability.

### Infrastructure as Code needs a state boundary
Terraform stores bindings between configuration instances and remote objects. Its documentation recommends a remote backend for collaboration and cautions against storing state in version control without locking and access protection. State can contain sensitive information. [Terraform state](https://developer.hashicorp.com/terraform/language/state)

**Design implication:** Separate Terraform-managed infrastructure from the asynchronous server lifecycle service’s operational metadata. Explain how drift is detected, how overlapping changes are coordinated, and how partially provisioned hosts are reconciled. Terraform configuration alone does not establish that firmware, hardware validation or customer readiness succeeded.

## Mapping the supplied resume

| Role theme | Resume evidence | Portfolio treatment |
|---|---|---|
| Hardware bring-up and validation | Shape bring-up from 6 weeks to 10 days across 1,200+ nodes; rack yield 86% to 98% | GPU platform node, bring-up metric and yield highlight |
| Provisioning | 75% faster, under 20 minutes; PXE/iPXE, DHCP/DNS, imaging and attestation | Provisioning node and lifecycle diagram |
| Firmware orchestration | 3,000+ upgrades; canaries, rollback and drift detection | Firmware node and experience |
| Distributed persistence | 99.99% availability on 12K+ nodes; PostgreSQL and Cassandra replication | Control-plane availability and Keystone |
| Infrastructure as Code | Terraform provisioning; Docker and Helm rollouts across 800+ hosts | Automation narrative |
| Systems triage | 45% lower MTTR; kernel, PCIe, NVMe and DMA debugging | Linux diagnostics node |
| Fleet placement | Oxide-HV host scoring and failure evacuation | Featured project with supplied demo |

Resume claims are preserved as supplied and have not been independently audited. All 15 experience bullets are verbatim. Keystone and Oxide-HV use this resume’s project descriptions. The public site avoids employer application language and Oracle branding or implied employment.

## Preparation questions
Explain a server lifecycle as a state machine, including interruption and safe retry at every transition. Describe an update that succeeds on the controller but leaves the host unhealthy. Show how a hardware defect was distinguished from firmware, kernel or configuration behavior. Explain which quality gate improved rack yield and how false failures were handled. Walk through metadata durability, partition behavior and recovery in a provisioning control plane. Present how a change crosses team boundaries with clear ownership, validation evidence and rollback criteria.

## Delivery
The website includes 23 distinct user-listed projects (EXPOS deduplicated), SourceCode links for all, and Technical Demo only for Oxide-HV, TradeSentinel, AskMyStore and Strangers. It has animated native SVG background imagery, moving lifecycle paths, canvas graphics, rotating text and project search. No LinkedIn or footer is included.


