/**
 * Protocol Ledger page: a split index workspace with compact operational type, cobalt analysis signals, and Forge Lime action states.
 */
import { useMemo, useState } from "react";
import {
  Activity,
  ArrowDownUp,
  ArrowRight,
  Binary,
  Blocks,
  Braces,
  Calculator,
  Check,
  ChevronRight,
  CircleDollarSign,
  Code2,
  Copy,
  Cpu,
  FileCode2,
  FileLock2,
  Gauge,
  Hash,
  Layers3,
  LineChart,
  LockKeyhole,
  Menu,
  Network,
  Percent,
  Search,
  ShieldCheck,
  Sparkles,
  Terminal,
  Timer,
  TrendingUp,
  WalletCards,
  X,
  Zap,
} from "lucide-react";

type ToolKind =
  | "crypto"
  | "gas"
  | "dca"
  | "apr"
  | "roi"
  | "address"
  | "json"
  | "hash"
  | "uuid"
  | "base64"
  | "timestamp"
  | "case"
  | "slug"
  | "generic";

type Tool = {
  id: number;
  name: string;
  category: string;
  description: string;
  code: string;
  kind: ToolKind;
  live?: boolean;
};

const categoryMeta = [
  { name: "On-chain", icon: Network, count: 18 },
  { name: "Wallet", icon: WalletCards, count: 16 },
  { name: "Trading", icon: LineChart, count: 22 },
  { name: "DeFi", icon: Layers3, count: 24 },
  { name: "Developer", icon: Code2, count: 34 },
  { name: "Security", icon: ShieldCheck, count: 17 },
  { name: "Money", icon: CircleDollarSign, count: 28 },
  { name: "Text & Data", icon: FileCode2, count: 30 },
  { name: "Files", icon: Binary, count: 16 },
  { name: "Planning", icon: Timer, count: 25 },
];

const catalog: Tool[] = [
  { id: 1, name: "Crypto Converter", category: "On-chain", description: "Convert assets, stablecoins, sats, gwei, and fiat values.", code: "FX", kind: "crypto", live: true },
  { id: 2, name: "Gas Estimator", category: "On-chain", description: "Estimate transaction cost across base fee and priority fee.", code: "GAS", kind: "gas", live: true },
  { id: 3, name: "Address Inspector", category: "On-chain", description: "Check EVM address structure and inspect its format locally.", code: "0X", kind: "address", live: true },
  { id: 4, name: "Nonce Planner", category: "On-chain", description: "Plan replacement and cancellation transaction nonces.", code: "N", kind: "generic" },
  { id: 5, name: "Block Time Converter", category: "On-chain", description: "Turn block intervals into estimated wall-clock durations.", code: "BLK", kind: "timestamp" },
  { id: 6, name: "Unit Converter", category: "On-chain", description: "Convert wei, gwei, ether, sats, and atomic token units.", code: "1E", kind: "crypto" },
  { id: 7, name: "Calldata Size", category: "On-chain", description: "Estimate bytes, zero-byte savings, and calldata cost.", code: "BY", kind: "generic" },
  { id: 8, name: "EIP-1559 Planner", category: "On-chain", description: "Model a max fee and priority fee strategy.", code: "1559", kind: "gas" },
  { id: 9, name: "Bridge Fee Calculator", category: "On-chain", description: "Compare transfer amount, bridge fee, and destination value.", code: "BR", kind: "generic" },
  { id: 10, name: "ENS Name Check", category: "On-chain", description: "Validate the local syntax of a human-readable name.", code: "ENS", kind: "generic" },
  { id: 11, name: "Wallet Splitter", category: "Wallet", description: "Split asset values across contributors or destination wallets.", code: "SPL", kind: "generic" },
  { id: 12, name: "Seed Phrase Checklist", category: "Wallet", description: "Create a secure offline backup checklist.", code: "12", kind: "generic" },
  { id: 13, name: "Portfolio Allocation", category: "Wallet", description: "Set target percentages and calculate rebalancing gaps.", code: "%", kind: "generic" },
  { id: 14, name: "Wallet Label Maker", category: "Wallet", description: "Generate consistent names for accounts and vaults.", code: "TAG", kind: "slug" },
  { id: 15, name: "Multi-sig Threshold", category: "Wallet", description: "Compare signer count with required signing threshold.", code: "M/N", kind: "generic" },
  { id: 16, name: "Allowance Checklist", category: "Wallet", description: "Build a structured review list for token approvals.", code: "APP", kind: "generic" },
  { id: 17, name: "Hardware Wallet Audit", category: "Wallet", description: "Review device handling and transaction checks.", code: "HW", kind: "generic" },
  { id: 18, name: "Watchlist Builder", category: "Wallet", description: "Create a clean asset or wallet watchlist format.", code: "WL", kind: "generic" },
  { id: 19, name: "ROI Calculator", category: "Trading", description: "Calculate return, return percentage, and price movement.", code: "ROI", kind: "roi", live: true },
  { id: 20, name: "DCA Planner", category: "Trading", description: "Project recurring purchases over a chosen horizon.", code: "DCA", kind: "dca", live: true },
  { id: 21, name: "Risk/Reward", category: "Trading", description: "Compare entry, stop, and target with an R multiple.", code: "R:R", kind: "roi" },
  { id: 22, name: "Position Size", category: "Trading", description: "Size a trade from account balance and invalidation point.", code: "PS", kind: "generic" },
  { id: 23, name: "Liquidation Price", category: "Trading", description: "Estimate isolated leverage liquidation boundaries.", code: "LIQ", kind: "generic" },
  { id: 24, name: "Funding Rate", category: "Trading", description: "Model periodic funding cost against a notional size.", code: "FR", kind: "generic" },
  { id: 25, name: "Break-even Price", category: "Trading", description: "Find the sale price after fees and slippage.", code: "B/E", kind: "roi" },
  { id: 26, name: "P&L Journal", category: "Trading", description: "Turn trade data into a compact journal-ready record.", code: "P/L", kind: "generic" },
  { id: 27, name: "APR Calculator", category: "DeFi", description: "Estimate simple yield from principal, APR, and time.", code: "APR", kind: "apr", live: true },
  { id: 28, name: "APY Converter", category: "DeFi", description: "Convert simple APR to compounded annual yield.", code: "APY", kind: "apr" },
  { id: 29, name: "Impermanent Loss", category: "DeFi", description: "Estimate divergence loss between two pooled assets.", code: "IL", kind: "generic" },
  { id: 30, name: "Staking Reward", category: "DeFi", description: "Model validator or delegate reward accrual.", code: "STK", kind: "apr" },
  { id: 31, name: "Lending Health", category: "DeFi", description: "Calculate a simple collateral health ratio.", code: "HLT", kind: "generic" },
  { id: 32, name: "Vault Share Price", category: "DeFi", description: "Convert vault shares and underlying token value.", code: "VLT", kind: "generic" },
  { id: 33, name: "Token Emissions", category: "DeFi", description: "Schedule emissions, unlocks, and remaining supply.", code: "EM", kind: "generic" },
  { id: 34, name: "Liquidity Range", category: "DeFi", description: "Plan a price range and capital deployment window.", code: "LP", kind: "generic" },
  { id: 35, name: "JSON Formatter", category: "Developer", description: "Validate, indent, minify, and copy JSON locally.", code: "{}", kind: "json", live: true },
  { id: 36, name: "Hash Generator", category: "Developer", description: "Generate a SHA-256 digest with Web Crypto.", code: "#", kind: "hash", live: true },
  { id: 37, name: "UUID Generator", category: "Developer", description: "Create a cryptographically random UUID v4.", code: "ID", kind: "uuid", live: true },
  { id: 38, name: "Base64 Encoder", category: "Developer", description: "Encode or decode text without uploading it.", code: "64", kind: "base64", live: true },
  { id: 39, name: "Timestamp Converter", category: "Developer", description: "Convert Unix seconds into readable local time.", code: "TS", kind: "timestamp", live: true },
  { id: 40, name: "ABI Snippet Cleaner", category: "Developer", description: "Normalize pasted ABI fragments for quick review.", code: "ABI", kind: "json" },
  { id: 41, name: "Keccak Input Prep", category: "Developer", description: "Prepare a UTF-8 or hex input for hashing workflows.", code: "K", kind: "hash" },
  { id: 42, name: "Contract Size Check", category: "Developer", description: "Measure deployment bytecode length and threshold.", code: "KB", kind: "generic" },
  { id: 43, name: "Solidity Scaffold", category: "Developer", description: "Generate a plain starter contract outline.", code: "SOL", kind: "generic" },
  { id: 44, name: "Merkle List Prep", category: "Developer", description: "Clean a list of leaves for a Merkle workflow.", code: "MRK", kind: "generic" },
  { id: 45, name: "JWT Decoder", category: "Developer", description: "Inspect token payloads in a local readable view.", code: "JWT", kind: "base64" },
  { id: 46, name: "Regex Tester", category: "Developer", description: "Test pattern matching against input text.", code: ".*", kind: "generic" },
  { id: 47, name: "Password Generator", category: "Security", description: "Generate strong random credentials and passphrases.", code: "PW", kind: "uuid", live: true },
  { id: 48, name: "Signature Checklist", category: "Security", description: "Review critical data before signing a message.", code: "SIG", kind: "generic" },
  { id: 49, name: "Phishing Review", category: "Security", description: "Use a structured check before connecting a wallet.", code: "PH", kind: "generic" },
  { id: 50, name: "Approval Risk Notes", category: "Security", description: "Record allowance, spender, and expiry details.", code: "AR", kind: "generic" },
  { id: 51, name: "Private Key Format", category: "Security", description: "Check hexadecimal key shape without sending it away.", code: "KEY", kind: "address" },
  { id: 52, name: "Domain Age Checklist", category: "Security", description: "Keep an audit record for domain trust signals.", code: "AGE", kind: "generic" },
  { id: 53, name: "Compound Interest", category: "Money", description: "Project growth with contributions and compounding.", code: "A+", kind: "apr" },
  { id: 54, name: "Tax Lot Calculator", category: "Money", description: "Track entries, exits, cost basis, and proceeds.", code: "TAX", kind: "roi" },
  { id: 55, name: "Fee Calculator", category: "Money", description: "Compare gross value, fee rate, and net amount.", code: "FEE", kind: "generic" },
  { id: 56, name: "Inflation Adjuster", category: "Money", description: "Adjust present value for a future purchasing estimate.", code: "INF", kind: "generic" },
  { id: 57, name: "Revenue Split", category: "Money", description: "Divide a payment across a project team.", code: "DIV", kind: "generic" },
  { id: 58, name: "Vesting Calculator", category: "Money", description: "Plan cliffs, monthly unlocks, and remaining grants.", code: "VEST", kind: "generic" },
  { id: 59, name: "Case Converter", category: "Text & Data", description: "Switch text among title, upper, camel, snake, and kebab.", code: "Aa", kind: "case", live: true },
  { id: 60, name: "Slug Generator", category: "Text & Data", description: "Turn a title into a clean lowercase URL slug.", code: "SL", kind: "slug", live: true },
  { id: 61, name: "Word Counter", category: "Text & Data", description: "Count words, characters, lines, and reading time.", code: "#W", kind: "generic" },
  { id: 62, name: "CSV to JSON", category: "Text & Data", description: "Turn comma-separated rows into structured JSON.", code: "C/J", kind: "json" },
  { id: 63, name: "JSON to CSV", category: "Text & Data", description: "Prepare a JSON array for a portable data sheet.", code: "J/C", kind: "json" },
  { id: 64, name: "Markdown Preview", category: "Text & Data", description: "Write Markdown and review the rendered hierarchy.", code: "MD", kind: "generic" },
  { id: 65, name: "Image Resizer", category: "Files", description: "Plan image dimensions, aspect ratio, and output target.", code: "IMG", kind: "generic" },
  { id: 66, name: "PDF Merger", category: "Files", description: "Stage a document pack for a concise workflow.", code: "PDF", kind: "generic" },
  { id: 67, name: "Image to Base64", category: "Files", description: "Prepare image data for a development workflow.", code: "I64", kind: "base64" },
  { id: 68, name: "CSV Viewer", category: "Files", description: "Inspect a comma-separated table in a clear work view.", code: "CSV", kind: "generic" },
  { id: 69, name: "Time Zone Converter", category: "Planning", description: "Compare schedule times across major world zones.", code: "TZ", kind: "timestamp" },
  { id: 70, name: "Date Difference", category: "Planning", description: "Measure days, weeks, and time remaining.", code: "DATE", kind: "timestamp" },
  { id: 71, name: "Percentage Calculator", category: "Planning", description: "Solve percentages, increases, decreases, and deltas.", code: "%", kind: "generic" },
  { id: 72, name: "Random Number", category: "Planning", description: "Generate cryptographically secure random values.", code: "RNG", kind: "uuid" },
];

const featured = [catalog[0], catalog[1], catalog[26], catalog[35]];
const categoryStarts = new Set([1, 11, 19, 27, 35, 47, 53, 59, 65, 69]);

function IconForTool({ category, size = 16 }: { category: string; size?: number }) {
  const Icon = categoryMeta.find((item) => item.name === category)?.icon ?? Blocks;
  return <Icon size={size} strokeWidth={1.8} />;
}

function formatMoney(value: number, digits = 2) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: digits }).format(Number.isFinite(value) ? value : 0);
}

function copyText(text: string, setCopied: (value: boolean) => void) {
  navigator.clipboard?.writeText(text);
  setCopied(true);
  window.setTimeout(() => setCopied(false), 1600);
}

function ToolBench({ tool, onClose }: { tool: Tool; onClose: () => void }) {
  const [amount, setAmount] = useState("1");
  const [price, setPrice] = useState("67420");
  const [gwei, setGwei] = useState("18");
  const [gasUnits, setGasUnits] = useState("65000");
  const [months, setMonths] = useState("12");
  const [rate, setRate] = useState("7.5");
  const [entry, setEntry] = useState("52000");
  const [exit, setExit] = useState("67420");
  const [units, setUnits] = useState("0.25");
  const [address, setAddress] = useState("0x742d35Cc6634C0532925a3b8D34aC3A20Bf9B9d3");
  const [text, setText] = useState('{\n  "chain": "Ethereum",\n  "status": "ready"\n}');
  const [output, setOutput] = useState("Ready for input.");
  const [copied, setCopied] = useState(false);

  const toolNumber = String(tool.id).padStart(2, "0");
  const compactInput = "w-full border border-slate-700/80 bg-slate-950/55 px-3 py-2.5 font-mono text-xs text-slate-100 outline-none transition focus:border-blue-400/80";
  const actionButton = "forge-button inline-flex items-center justify-center gap-2 bg-[#b8ff3d] px-3 py-2.5 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-slate-950 transition hover:bg-[#d1ff79]";

  const outputCard = (label: string, value: string, detail: string) => (
    <div className="mt-4 border border-blue-300/15 bg-blue-400/[0.06] p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-slate-400">{label}</span>
        <div className="signal-dot" />
      </div>
      <div className="font-['Space_Grotesk'] text-2xl font-semibold tracking-tight text-white">{value}</div>
      <p className="mt-1 font-mono text-[10px] leading-5 text-slate-400">{detail}</p>
    </div>
  );

  const content = () => {
    if (tool.kind === "crypto") {
      const total = Number(amount) * Number(price);
      return <>
        <div className="grid grid-cols-2 gap-2"><label className="space-y-2 font-mono text-[9px] uppercase tracking-[0.12em] text-slate-500">Asset amount<input value={amount} onChange={(event) => setAmount(event.target.value)} className={compactInput} inputMode="decimal" /></label><label className="space-y-2 font-mono text-[9px] uppercase tracking-[0.12em] text-slate-500">Reference price<input value={price} onChange={(event) => setPrice(event.target.value)} className={compactInput} inputMode="decimal" /></label></div>
        {outputCard("Converted value", formatMoney(total), `${amount || "0"} ETH at ${formatMoney(Number(price))} reference price`)}
      </>;
    }
    if (tool.kind === "gas") {
      const ethCost = Number(gwei) * Number(gasUnits) / 1_000_000_000;
      const usdCost = ethCost * 67420;
      return <>
        <div className="grid grid-cols-2 gap-2"><label className="space-y-2 font-mono text-[9px] uppercase tracking-[0.12em] text-slate-500">Gas units<input value={gasUnits} onChange={(event) => setGasUnits(event.target.value)} className={compactInput} inputMode="decimal" /></label><label className="space-y-2 font-mono text-[9px] uppercase tracking-[0.12em] text-slate-500">Fee in gwei<input value={gwei} onChange={(event) => setGwei(event.target.value)} className={compactInput} inputMode="decimal" /></label></div>
        {outputCard("Estimated cost", formatMoney(usdCost), `${ethCost.toFixed(6)} ETH at an ETH reference price of ${formatMoney(67420)}`)}
      </>;
    }
    if (tool.kind === "dca") {
      const monthly = Number(amount) || 0;
      const cycleCount = Number(months) || 0;
      const spend = monthly * cycleCount;
      const acquired = spend / (Number(price) || 1);
      return <>
        <div className="grid grid-cols-2 gap-2"><label className="space-y-2 font-mono text-[9px] uppercase tracking-[0.12em] text-slate-500">Monthly buy<input value={amount} onChange={(event) => setAmount(event.target.value)} className={compactInput} inputMode="decimal" /></label><label className="space-y-2 font-mono text-[9px] uppercase tracking-[0.12em] text-slate-500">Months<input value={months} onChange={(event) => setMonths(event.target.value)} className={compactInput} inputMode="numeric" /></label></div><label className="mt-3 block space-y-2 font-mono text-[9px] uppercase tracking-[0.12em] text-slate-500">Reference price<input value={price} onChange={(event) => setPrice(event.target.value)} className={compactInput} inputMode="decimal" /></label>
        {outputCard("Plan projection", `${acquired.toFixed(5)} ETH`, `${formatMoney(spend)} total planned allocation across ${cycleCount} periods`)}
      </>;
    }
    if (tool.kind === "apr") {
      const projected = Number(amount) * (1 + Number(rate) / 100 * Number(months) / 12);
      const gain = projected - Number(amount);
      return <>
        <div className="grid grid-cols-2 gap-2"><label className="space-y-2 font-mono text-[9px] uppercase tracking-[0.12em] text-slate-500">Principal<input value={amount} onChange={(event) => setAmount(event.target.value)} className={compactInput} inputMode="decimal" /></label><label className="space-y-2 font-mono text-[9px] uppercase tracking-[0.12em] text-slate-500">APR %<input value={rate} onChange={(event) => setRate(event.target.value)} className={compactInput} inputMode="decimal" /></label></div><label className="mt-3 block space-y-2 font-mono text-[9px] uppercase tracking-[0.12em] text-slate-500">Months<input value={months} onChange={(event) => setMonths(event.target.value)} className={compactInput} inputMode="numeric" /></label>
        {outputCard("Simple yield", `${projected.toFixed(4)} units`, `${gain.toFixed(4)} units of projected gain over ${months} months`)}
      </>;
    }
    if (tool.kind === "roi") {
      const spent = Number(entry) * Number(units);
      const received = Number(exit) * Number(units);
      const profit = received - spent;
      const percentage = spent ? (profit / spent) * 100 : 0;
      return <>
        <div className="grid grid-cols-3 gap-2"><label className="space-y-2 font-mono text-[9px] uppercase tracking-[0.12em] text-slate-500">Entry<input value={entry} onChange={(event) => setEntry(event.target.value)} className={compactInput} inputMode="decimal" /></label><label className="space-y-2 font-mono text-[9px] uppercase tracking-[0.12em] text-slate-500">Exit<input value={exit} onChange={(event) => setExit(event.target.value)} className={compactInput} inputMode="decimal" /></label><label className="space-y-2 font-mono text-[9px] uppercase tracking-[0.12em] text-slate-500">Units<input value={units} onChange={(event) => setUnits(event.target.value)} className={compactInput} inputMode="decimal" /></label></div>
        {outputCard("Estimated return", `${percentage.toFixed(2)}%`, `${formatMoney(profit)} net movement, before fees and slippage`)}
      </>;
    }
    if (tool.kind === "address") {
      const valid = /^0x[a-fA-F0-9]{40}$/.test(address);
      return <>
        <label className="block space-y-2 font-mono text-[9px] uppercase tracking-[0.12em] text-slate-500">EVM address<input value={address} onChange={(event) => setAddress(event.target.value)} className={compactInput} /></label>
        {outputCard("Local structure check", valid ? "Format passes" : "Format invalid", valid ? `${address.slice(0, 10)}...${address.slice(-8)} · 20-byte hexadecimal address pattern.` : "A standard EVM address begins with 0x and contains 40 hexadecimal characters.")}
      </>;
    }
    if (tool.kind === "json") {
      const format = () => { try { setOutput(JSON.stringify(JSON.parse(text), null, 2)); } catch { setOutput("Invalid JSON. Check quotes, commas, and brackets."); } };
      return <><label className="block space-y-2 font-mono text-[9px] uppercase tracking-[0.12em] text-slate-500">JSON input<textarea value={text} onChange={(event) => setText(event.target.value)} className={`${compactInput} h-28 resize-none leading-5`} /></label><button className={`${actionButton} mt-3 w-full`} onClick={format}><Braces size={14} />Format JSON</button>{outputCard("Output", output, "Formatting happens in your browser.")}</>;
    }
    if (tool.kind === "hash") {
      const hashText = async () => { const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text)); setOutput(Array.from(new Uint8Array(digest)).map((item) => item.toString(16).padStart(2, "0")).join("")); };
      return <><label className="block space-y-2 font-mono text-[9px] uppercase tracking-[0.12em] text-slate-500">Input text<textarea value={text} onChange={(event) => setText(event.target.value)} className={`${compactInput} h-24 resize-none leading-5`} /></label><button className={`${actionButton} mt-3 w-full`} onClick={hashText}><Hash size={14} />Generate SHA-256</button>{outputCard("SHA-256", output === "Ready for input." ? "Ready" : `${output.slice(0, 24)}...`, "Digest generated with the browser Web Crypto API.")}</>;
    }
    if (tool.kind === "uuid") {
      const generate = () => setOutput(crypto.randomUUID());
      return <><p className="font-mono text-[11px] leading-6 text-slate-400">Generate a local cryptographically random identifier. Use it for records, labels, test data, or safely named work items.</p><button className={`${actionButton} mt-4 w-full`} onClick={generate}><Sparkles size={14} />Generate identifier</button>{outputCard("Generated UUID", output === "Ready for input." ? "Awaiting run" : output, "No identifier data leaves this page.")}</>;
    }
    if (tool.kind === "base64") {
      const encode = () => setOutput(btoa(unescape(encodeURIComponent(text))));
      const decode = () => { try { setOutput(decodeURIComponent(escape(atob(text)))); } catch { setOutput("Unable to decode this Base64 input."); } };
      return <><label className="block space-y-2 font-mono text-[9px] uppercase tracking-[0.12em] text-slate-500">Text or Base64<textarea value={text} onChange={(event) => setText(event.target.value)} className={`${compactInput} h-24 resize-none leading-5`} /></label><div className="mt-3 grid grid-cols-2 gap-2"><button className={actionButton} onClick={encode}>Encode</button><button className="forge-button border border-slate-600 px-3 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-200 transition hover:border-blue-300 hover:text-white" onClick={decode}>Decode</button></div>{outputCard("Output", output, "Transforms run only in this browser session.")}</>;
    }
    if (tool.kind === "timestamp") {
      const seconds = Number(amount) || Math.floor(Date.now() / 1000);
      const date = new Date(seconds * 1000);
      return <><label className="block space-y-2 font-mono text-[9px] uppercase tracking-[0.12em] text-slate-500">Unix seconds<input value={amount} onChange={(event) => setAmount(event.target.value)} className={compactInput} inputMode="numeric" /></label>{outputCard("Local time", date.toLocaleString(), `${seconds} seconds since the Unix epoch.`)}</>;
    }
    if (tool.kind === "case" || tool.kind === "slug") {
      const transform = () => { const clean = text.trim(); if (tool.kind === "slug") setOutput(clean.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")); else setOutput(clean.split(/\s+/).map((word) => word[0]?.toUpperCase() + word.slice(1).toLowerCase()).join(" ")); };
      return <><label className="block space-y-2 font-mono text-[9px] uppercase tracking-[0.12em] text-slate-500">Source text<textarea value={text} onChange={(event) => setText(event.target.value)} className={`${compactInput} h-24 resize-none leading-5`} /></label><button className={`${actionButton} mt-3 w-full`} onClick={transform}>{tool.kind === "slug" ? "Generate slug" : "Convert title case"}</button>{outputCard("Output", output, "Text stays in your browser.")}</>;
    }
    return <><div className="border border-dashed border-slate-600/80 bg-slate-950/35 p-4"><Terminal size={17} className="mb-3 text-[#b8ff3d]" /><p className="font-mono text-[11px] leading-6 text-slate-400">This tool is indexed and ready for a focused module. The workbench preserves its current row and metadata while the full operator flow is staged.</p></div><div className="mt-4 grid grid-cols-2 gap-2"><div className="border border-slate-700 bg-slate-950/50 p-3"><div className="font-mono text-[9px] uppercase tracking-[0.13em] text-slate-500">Mode</div><div className="mt-2 font-mono text-xs text-slate-200">Private local</div></div><div className="border border-slate-700 bg-slate-950/50 p-3"><div className="font-mono text-[9px] uppercase tracking-[0.13em] text-slate-500">Status</div><div className="mt-2 flex items-center gap-2 font-mono text-xs text-slate-200"><span className="h-1.5 w-1.5 rounded-full bg-[#b8ff3d]" />Indexed</div></div></div></>;
  };

  return <aside className="forge-panel relative flex min-h-[590px] flex-col overflow-hidden p-5 lg:sticky lg:top-5 lg:h-[calc(100vh-2.5rem)]">
    <div className="absolute inset-0 forge-noise opacity-20 pointer-events-none" />
    <div className="relative flex items-start justify-between gap-3 border-b border-slate-700/75 pb-4">
      <div className="flex gap-3"><div className="flex h-10 w-10 shrink-0 items-center justify-center border border-blue-300/30 bg-blue-500/10 text-blue-200"><IconForTool category={tool.category} size={18} /></div><div><div className="font-mono text-[9px] uppercase tracking-[0.16em] text-slate-500">Tool {toolNumber} · {tool.category}</div><h2 className="mt-1 font-['Space_Grotesk'] text-xl font-semibold tracking-tight text-white">{tool.name}</h2></div></div><button onClick={onClose} className="border border-slate-700 p-2 text-slate-400 transition hover:border-slate-500 hover:text-white" aria-label="Close tool bench"><X size={15} /></button>
    </div>
    <p className="relative mt-4 font-mono text-[11px] leading-5 text-slate-400">{tool.description}</p>
    <div className="relative flex-1 py-5">{content()}</div>
    <div className="relative mt-auto flex items-center justify-between border-t border-slate-700/75 pt-4"><div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.12em] text-slate-500"><LockKeyhole size={12} />Local session</div><button onClick={() => copyText(output, setCopied)} className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.12em] text-slate-300 transition hover:text-[#b8ff3d]">{copied ? <Check size={13} /> : <Copy size={13} />}{copied ? "Copied" : "Copy output"}</button></div>
  </aside>;
}

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("All tools");
  const [query, setQuery] = useState("");
  const [selectedTool, setSelectedTool] = useState<Tool>(catalog[0]);
  const [mobileNav, setMobileNav] = useState(false);

  const filteredTools = useMemo(() => catalog.filter((tool) => {
    const matchesCategory = activeCategory === "All tools" || tool.category === activeCategory;
    const needle = query.toLowerCase().trim();
    return matchesCategory && (!needle || `${tool.name} ${tool.description} ${tool.category}`.toLowerCase().includes(needle));
  }), [activeCategory, query]);

  const chooseTool = (tool: Tool) => {
    setSelectedTool(tool);
  };

  return <div className="min-h-screen bg-[#11162a] text-slate-100">
    <div className="fixed inset-0 forge-grid pointer-events-none opacity-70" />
    <div className="fixed inset-0 bg-[radial-gradient(circle_at_76%_0%,rgba(67,98,227,0.19),transparent_29%),radial-gradient(circle_at_6%_90%,rgba(184,255,61,0.06),transparent_25%)] pointer-events-none" />
    <main className="relative mx-auto max-w-[1680px] px-3 py-3 sm:px-5 sm:py-5">
      <div className="grid min-h-[calc(100vh-2.5rem)] grid-cols-1 overflow-hidden border border-slate-700/80 bg-[#151b31]/90 shadow-[0_35px_120px_rgba(0,0,0,0.38)] lg:grid-cols-[220px_minmax(0,1fr)_370px]">
        <aside className={`${mobileNav ? "block" : "hidden"} border-b border-slate-700/80 bg-[#101527] p-4 lg:block lg:border-b-0 lg:border-r lg:p-5`}>
          <div className="mb-9 flex items-center justify-between lg:block"><div className="flex items-center gap-3"><div className="relative flex h-10 w-10 items-center justify-center overflow-hidden bg-[#b8ff3d] shadow-[0_0_22px_rgba(184,255,61,0.16)]"><img src="/manus-storage/chainforge-mark_11fbc02a.png" alt="ChainForge logo" className="h-10 w-10 object-contain" /><span className="absolute inset-0 border border-[#d5ff89]/80" /></div><div><div className="font-['Space_Grotesk'] text-base font-semibold tracking-[-0.06em] text-white">chainforge</div><div className="font-mono text-[8px] uppercase tracking-[0.18em] text-[#b8ff3d]">tools.v01</div></div></div><button onClick={() => setMobileNav(false)} className="border border-slate-700 p-2 text-slate-400 lg:hidden"><X size={16} /></button></div>
          <nav><div className="mb-2 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.16em] text-slate-500"><span>Directory</span><span>246</span></div><button onClick={() => setActiveCategory("All tools")} className={`mb-1 flex w-full items-center gap-3 border-l-2 px-3 py-2.5 text-left font-mono text-[11px] transition ${activeCategory === "All tools" ? "border-[#b8ff3d] bg-[#b8ff3d]/8 text-white" : "border-transparent text-slate-400 hover:bg-slate-800/55 hover:text-slate-200"}`}><Blocks size={15} />All tools<span className="ml-auto text-[9px] text-slate-500">246</span></button>{categoryMeta.map(({ name, icon: Icon, count }) => <button key={name} onClick={() => setActiveCategory(name)} className={`mb-1 flex w-full items-center gap-3 border-l-2 px-3 py-2.5 text-left font-mono text-[11px] transition ${activeCategory === name ? "border-[#b8ff3d] bg-[#b8ff3d]/8 text-white" : "border-transparent text-slate-400 hover:bg-slate-800/55 hover:text-slate-200"}`}><Icon size={15} />{name}<span className="ml-auto text-[9px] text-slate-500">{count}</span></button>)}</nav>
          <div className="mt-10 border-t border-slate-700/80 pt-5"><div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.14em] text-slate-400"><span className="signal-dot" />Local-first tools</div><p className="mt-2 font-mono text-[10px] leading-5 text-slate-500">Inputs stay in your browser unless a tool explicitly says otherwise.</p></div>
        </aside>

        <section className="min-w-0 bg-[#171d34]/75">
          <header className="flex items-center justify-between border-b border-slate-700/80 px-5 py-4 sm:px-8"><button onClick={() => setMobileNav(true)} className="border border-slate-700 p-2 text-slate-300 lg:hidden"><Menu size={17} /></button><div className="hidden items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-400 lg:flex"><span className="h-1.5 w-1.5 rounded-full bg-[#b8ff3d] shadow-[0_0_12px_#b8ff3d]" />System online <span className="text-slate-600">/</span> 246 utilities indexed</div><div className="ml-auto flex items-center gap-4"><button onClick={() => chooseTool(catalog[36])} className="hidden items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-400 transition hover:text-white sm:flex"><FileLock2 size={14} />Private mode</button><div className="font-mono text-[10px] text-slate-500">v0.1.0</div></div></header>

          <div className="border-b border-slate-700/80 px-5 pb-7 pt-9 sm:px-8 sm:pt-12"><div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_230px]"><div><div className="mb-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[#b8ff3d]"><span className="font-['DM_Mono'] text-base tracking-[-0.28em]">[/]</span><span className="h-px w-8 bg-[#b8ff3d]" />An indexed crypto workbench</div><h1 className="max-w-3xl font-['Space_Grotesk'] text-4xl font-semibold leading-[0.98] tracking-[-0.065em] text-white sm:text-5xl xl:text-6xl">Utilities for the <span className="text-blue-300">on-chain work</span> in front of you.</h1><p className="mt-5 max-w-xl text-sm leading-7 text-slate-400">Fast tools for wallet operations, DeFi planning, developer cleanup, finance math, files, and the small calculations that keep a crypto workflow moving.</p></div><div className="relative hidden min-h-48 overflow-hidden border border-blue-300/15 bg-slate-950/45 xl:block"><img src="/manus-storage/chainforge-tool-atlas_6a8c2211.png" alt="ChainForge material tool atlas" className="absolute inset-0 h-full w-full object-cover opacity-75" /><div className="absolute inset-0 bg-gradient-to-r from-[#171d34] via-[#171d34]/15 to-transparent" /><div className="absolute bottom-4 left-4 font-mono text-[9px] uppercase tracking-[0.16em] text-slate-300"><span className="text-[#b8ff3d]">[/]</span> Ledger atlas / 03</div></div></div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row"><label className="relative min-w-0 flex-1"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300" size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search converter, gas, JSON, wallet, DCA..." className="w-full border border-slate-600 bg-[#0f1426] py-4 pl-11 pr-4 font-mono text-xs text-white outline-none transition placeholder:text-slate-500 focus:border-blue-300/80 focus:ring-2 focus:ring-blue-400/10" /></label><button onClick={() => chooseTool(catalog[1])} className="forge-button inline-flex items-center justify-center gap-2 border border-[#b8ff3d] bg-[#b8ff3d] px-5 py-3.5 font-mono text-[10px] uppercase tracking-[0.16em] text-slate-950 transition hover:bg-[#d4ff80]"><Zap size={15} />Open gas estimator</button></div>
          </div>

          <div className="p-5 sm:p-8"><div className="mb-5 flex items-end justify-between gap-3"><div><div className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500">Featured pathways</div><h2 className="mt-1 font-['Space_Grotesk'] text-xl font-semibold tracking-[-0.04em] text-white">Start with a working module.</h2></div><div className="font-mono text-[10px] text-slate-500">04 selected</div></div><div className="grid gap-2 md:grid-cols-2">{featured.map((tool, index) => <button onClick={() => chooseTool(tool)} key={tool.id} className="tool-row group flex items-start gap-3 border border-slate-700/80 bg-[#12182c]/75 p-4 text-left"><div className="flex h-8 w-8 shrink-0 items-center justify-center border border-blue-300/20 bg-blue-500/10 font-mono text-[10px] text-blue-200">0{index + 1}</div><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-2"><span className="font-mono text-[11px] text-white">{tool.name}</span><ArrowRight size={14} className="text-slate-500 transition group-hover:translate-x-1 group-hover:text-[#b8ff3d]" /></div><p className="mt-1 font-mono text-[10px] leading-5 text-slate-500">{tool.description}</p></div></button>)}</div>

            <div className="mb-4 mt-10 flex flex-wrap items-center justify-between gap-3 border-b border-slate-700/80 pb-4"><div><div className="font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500">{activeCategory === "All tools" ? "Complete index" : activeCategory}</div><h2 className="mt-1 font-['Space_Grotesk'] text-xl font-semibold tracking-[-0.04em] text-white">{filteredTools.length} matching tools</h2></div><div className="flex items-center gap-2 font-mono text-[10px] text-slate-500"><Activity size={14} className="text-[#b8ff3d]" />Filtered locally</div></div>
            <div className="grid gap-2">{filteredTools.map((tool) => { const isLedgerStart = activeCategory === "All tools" && categoryStarts.has(tool.id); const sectionNumber = String(categoryMeta.findIndex((item) => item.name === tool.category) + 1).padStart(2, "0"); return <button key={tool.id} data-ledger={isLedgerStart ? `${sectionNumber} / ${tool.category}` : ""} onClick={() => chooseTool(tool)} className={`tool-row group grid grid-cols-[38px_38px_minmax(0,1fr)_18px] items-center gap-3 border p-3 text-left sm:grid-cols-[42px_44px_minmax(0,1fr)_22px] ${isLedgerStart ? "ledger-row" : ""} ${selectedTool.id === tool.id ? "border-blue-300/55 bg-blue-500/[0.08]" : "border-slate-700/80 bg-[#141a2f]/65"}`}><span className="font-mono text-[10px] text-slate-600">{String(tool.id).padStart(3, "0")}</span><span className="flex h-8 w-8 items-center justify-center border border-slate-600/80 font-mono text-[9px] text-slate-300"><IconForTool category={tool.category} size={14} /></span><span className="min-w-0"><span className="flex items-center gap-2"><span className="truncate font-mono text-[11px] text-slate-100">{tool.name}</span>{tool.live && <span className="inline-flex shrink-0 items-center gap-1 font-mono text-[8px] uppercase tracking-[0.1em] text-[#b8ff3d]"><span className="h-1 w-1 rounded-full bg-[#b8ff3d]" />live</span>}</span><span className="mt-1 block truncate font-mono text-[10px] text-slate-500">{tool.description}</span></span><ChevronRight size={16} className="text-slate-600 transition group-hover:translate-x-0.5 group-hover:text-[#b8ff3d]" /></button>; })}{filteredTools.length === 0 && <div className="border border-dashed border-slate-600 p-8 text-center"><Search size={20} className="mx-auto text-slate-500" /><p className="mt-3 font-mono text-xs text-slate-400">No tool matches this search.</p><button onClick={() => { setQuery(""); setActiveCategory("All tools"); }} className="mt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-[#b8ff3d]">Reset index</button></div>}</div>
          </div>
          <footer className="border-t border-slate-700/80 px-5 py-5 sm:px-8"><div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center"><p className="font-mono text-[10px] leading-5 text-slate-500">ChainForge is a local-first tool directory for calculation, formatting, and workflow prep. Review sensitive transactions before you sign.</p><div className="flex gap-4 font-mono text-[10px] uppercase tracking-[0.12em] text-slate-500"><span>Private by default</span><span>•</span><span>Built for work</span></div></div></footer>
        </section>

        <div className="border-t border-slate-700/80 bg-[#11172b] p-3 sm:p-5 lg:border-l lg:border-t-0"><ToolBench tool={selectedTool} onClose={() => setSelectedTool(catalog[0])} /></div>
      </div>
    </main>
  </div>;
}
