"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import CandidateCard from "../../components/CandidateCard";
import { auth, db } from "@/lib/firebase";
import {
	Send,
	CheckCircle,
	ShieldCheck,
	ChevronRight,
	LayoutList,
	Fingerprint,
	Lock,
	RefreshCcw,
	UserCircle2,
	Eye,
	EyeOff,
	ArrowRight,
	X,
} from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const POSITIONS = [
	"Moderator",
	"President",
	"Internal Vice President",
	"External Vice President",
	"Secretary",
	"Assistant Secretary",
	"Treasurer",
	"Assistant Treasurer",
	"Auditor",
	"Business Manager (Select 2)",
	"BSIT PIO",
	"BSCPE PIO",
	"BSECE PIO",
	"BLIS PIO",
];

const CANDIDATE_SLOTS = [1, 2, 3] as const;

type StepType = "form" | "ballot";

export default function CandidatesPage() {
	const [hasVoted, setHasVoted] = useState(false);
	const [selectedCandidates, setSelectedCandidates] = useState<Record<string, string>>({});
	const [isConfirming, setIsConfirming] = useState(false);
	const [showSummary, setShowSummary] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [isLoadingIdentity, setIsLoadingIdentity] = useState(true);

	const [step, setStep] = useState<StepType>("form");

	const [formData, setFormData] = useState({
		name: "",
		idNumber: "",
		section: "",
		hideName: false,
	});

	const [formErrors, setFormErrors] = useState({
		idNumber: "",
		section: "",
	});

	const { scrollYProgress } = useScroll();
	const scaleX = useSpring(scrollYProgress, {
		stiffness: 100,
		damping: 30,
		restDelta: 0.001,
	});

	const progress = useMemo(() => {
		return (Object.keys(selectedCandidates).length / POSITIONS.length) * 100;
	}, [selectedCandidates]);
	const selectedCount = Object.keys(selectedCandidates).length;

	useEffect(() => {
		const savedName = typeof window !== "undefined" ? localStorage.getItem("voterName") : null;
		const savedId = typeof window !== "undefined" ? localStorage.getItem("voterId") : null;

		const unsubscribe = onAuthStateChanged(auth, async (user) => {
			try {
				if (!user) {
					setFormData((prev) => ({
						...prev,
						name: savedName ?? prev.name,
						idNumber: savedId ?? prev.idNumber,
					}));
					return;
				}

				const userDoc = await getDoc(doc(db, "users", user.uid));
				const userData = userDoc.exists() ? userDoc.data() : null;
				const resolvedName =
					(userData?.fullName as string | undefined) ||
					(userData?.name as string | undefined) ||
					savedName ||
					user.displayName ||
					user.email ||
					"Voter";
				const resolvedId =
					(userData?.studentId as string | undefined) ||
					savedId ||
					user.uid.slice(0, 8);

				setFormData((prev) => ({
					...prev,
					name: resolvedName,
					idNumber: resolvedId,
				}));
			} finally {
				setIsLoadingIdentity(false);
			}
		});

		return () => unsubscribe();
	}, []);

	const handleVoteSubmit = useCallback(() => {
		if (selectedCount < POSITIONS.length) {
			const missing = POSITIONS.filter((p) => !selectedCandidates[p]);
			alert(`Please cast your vote for: ${missing[0]}`);
			return;
		}
		setIsConfirming(true);
	}, [selectedCandidates, selectedCount]);

	const finalSubmit = useCallback(() => {
		setSubmitting(true);
		setTimeout(() => {
			setHasVoted(true);
			setSubmitting(false);
		}, 2500);
	}, []);

	const validateForm = () => {
		const errors = {
			idNumber: "",
			section: "",
		};

		if (!formData.idNumber.trim()) {
			errors.idNumber = "ID Number is required.";
		}

		if (!formData.section.trim()) {
			errors.section = "Section is required.";
		}

		setFormErrors(errors);

		return !errors.idNumber && !errors.section;
	};

	const handleContinueToBallot = () => {
		if (!validateForm()) return;
		setStep("ballot");
	};

	const handleAbstain = useCallback((position: string) => {
		setSelectedCandidates((prev) => ({
			...prev,
			[position]: "abstain",
		}));
	}, []);

	const handleCandidateSelect = useCallback((position: string, candidateSlot: number) => {
		setSelectedCandidates((prev) => ({
			...prev,
			[position]: `c${candidateSlot}`,
		}));
	}, []);

	if (hasVoted) {
		return (
			<AnimatePresence>
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className="min-h-screen bg-white flex items-center justify-center p-6 overflow-hidden relative"
				>
					<div className="absolute inset-0 bg-orange-50/30 -z-10" />
					<motion.div
						initial={{ scale: 0.8, y: 20 }}
						animate={{ scale: 1, y: 0 }}
						className="bg-white p-12 rounded-[3.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] max-w-lg text-center border border-orange-100 relative overflow-hidden"
					>
						<div className="absolute top-0 left-0 w-full h-2 bg-green-500" />
						<motion.div
							initial={{ scale: 0 }}
							animate={{ scale: 1 }}
							transition={{ delay: 0.2, type: "spring" }}
							className="w-28 h-28 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner"
						>
							<CheckCircle size={56} strokeWidth={2.5} />
						</motion.div>

						<h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight uppercase italic">
							Receipt Issued
						</h2>

						<div className="bg-gray-50 rounded-2xl p-4 mb-8 flex flex-col gap-2">
							<p className="text-xs font-mono text-gray-400">TRANSACTION HASH</p>
							<p className="text-xs font-mono font-bold text-gray-700 truncate uppercase tracking-widest">
								CET-VOTE-2026-X89B-Q21Z-KLL9
							</p>
						</div>

						<p className="text-lg text-gray-500 mb-8 leading-relaxed">
							Your identity has been verified and your choices recorded. Digital democracy in action.
						</p>

						<Link
							href="/vote"
							className="w-full bg-[#111] text-white px-8 py-5 rounded-2xl font-black hover:bg-[#f05a28] transition-all shadow-2xl uppercase tracking-tighter flex items-center justify-center gap-3"
						>
							Finish Session <ChevronRight size={20} />
						</Link>
					</motion.div>
				</motion.div>
			</AnimatePresence>
		);
	}

	return (
		<main className="min-h-screen bg-[#FDFCFB] font-poppins pb-32 selection:bg-[#f05a28]/20">
			<Navbar />

			<motion.div
				className="fixed top-0 left-0 right-0 h-1.5 bg-[#f05a28] z-[110] origin-left"
				style={{ scaleX }}
			/>

			{step === "ballot" ? (
				<>
					{/* STICKY BAR */}
					<div className="sticky top-0 z-[60] bg-white/90 backdrop-blur-2xl border-b border-gray-100 py-4 shadow-sm">
						<div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
							<div className="flex items-center gap-4">
								<div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-[#f05a28] border border-gray-100 font-black italic">
									{Math.round(progress)}%
								</div>
								<div className="hidden sm:block">
									<p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
										Progress
									</p>
									<p className="text-sm font-black text-gray-900">
										{Object.keys(selectedCandidates).length} of {POSITIONS.length} Casted
									</p>
								</div>
							</div>

							<div className="flex items-center gap-3">
								<button
									onClick={() => setShowSummary(!showSummary)}
									className="px-6 py-3 rounded-2xl bg-gray-50 text-gray-900 text-xs font-black uppercase tracking-tight hover:bg-gray-100 transition-all flex items-center gap-2"
								>
									<LayoutList size={16} /> Summary
								</button>

								<button
									onClick={handleVoteSubmit}
									className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-tight transition-all flex items-center gap-2 shadow-lg ${
										progress === 100
											? "bg-[#f05a28] text-white shadow-[#f05a28]/20"
											: "bg-gray-200 text-gray-400 cursor-not-allowed"
									}`}
								>
									Cast Ballot <Send size={16} />
								</button>
							</div>
						</div>
						<div className="max-w-6xl mx-auto px-6 mt-3">
							<div className="h-2 rounded-full bg-gray-100 overflow-hidden">
								<div
									className="h-full bg-gradient-to-r from-[#f05a28] to-orange-400 transition-all duration-500"
									style={{ width: `${progress}%` }}
								/>
							</div>
						</div>
					</div>

					{/* VOTER BADGE */}
					<div className="max-w-6xl mx-auto px-6 pt-10">
						<div className="rounded-[2rem] border border-gray-100 bg-white shadow-sm p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
							<div className="flex items-center gap-4">
								<div className="w-14 h-14 rounded-2xl bg-orange-50 text-[#f05a28] flex items-center justify-center">
									<UserCircle2 size={28} />
								</div>
								<div>
									<p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em]">
										Verified Voter
									</p>
									<p className="text-lg font-black text-gray-900 uppercase tracking-tight">
										{formData.hideName ? "Anonymous Voter" : formData.name}
									</p>
									<p className="text-sm text-gray-500 font-semibold">
										{formData.idNumber} • {formData.section}
									</p>
								</div>
							</div>

							<button
								onClick={() => setStep("form")}
								className="px-6 py-3 rounded-2xl border border-gray-100 bg-gray-50 text-xs font-black uppercase tracking-tight hover:bg-gray-100 transition-all"
							>
								Edit Voter Info
							</button>
						</div>
					</div>

					<div className="max-w-6xl mx-auto pt-20 px-6">
						{POSITIONS.map((pos, index) => (
							<motion.section
								key={pos}
								initial={{ opacity: 0, y: 50 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true, margin: "-100px" }}
								className="mb-32 relative"
							>
								<div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
									<div className="flex items-center gap-6">
										<span className="text-7xl font-black text-gray-100 italic leading-none select-none">
											{String(index + 1).padStart(2, "0")}
										</span>
										<div>
											<h3 className="text-3xl font-[900] text-gray-900 uppercase tracking-tighter leading-none mb-2">
												{pos}
											</h3>
											<div className="flex items-center gap-3">
												<span className="h-0.5 w-8 bg-[#f05a28]" />
												<p className={`text-[10px] font-black uppercase tracking-[0.3em] ${selectedCandidates[pos] ? "text-green-600" : "text-[#f05a28]"}`}>
													{selectedCandidates[pos] ? "Selection Captured" : "Required Selection"}
												</p>
											</div>
										</div>
									</div>

									<button
										onClick={() => handleAbstain(pos)}
										className={`flex items-center gap-2 px-6 py-3 rounded-xl border-2 text-[10px] font-black uppercase tracking-widest transition-all ${
											selectedCandidates[pos] === "abstain"
												? "bg-gray-900 text-white border-gray-900"
												: "border-gray-100 text-gray-400 hover:border-gray-200"
										}`}
									>
										<RefreshCcw size={14} /> Abstain for this position
									</button>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
									{CANDIDATE_SLOTS.map((c) => (
										<CandidateCard
											key={c}
											name={`Candidate Name ${c}`}
											section={`BLOCK ${c}A`}
											bio="Platform: Dedicated to digital equity and student-led innovation through accessible CET labs and workshops."
											isSelected={selectedCandidates[pos] === `c${c}`}
											onSelect={() => handleCandidateSelect(pos, c)}
										/>
									))}
								</div>
							</motion.section>
						))}
					</div>
				</>
			) : (
				<>
					<div className="max-w-6xl mx-auto px-6 pt-14">
						{step === "form" && (
							<motion.div
								initial={{ opacity: 0, y: 35 }}
								animate={{ opacity: 1, y: 0 }}
								className="max-w-4xl mx-auto"
							>
								<div className="rounded-[2.8rem] border border-gray-100 bg-white shadow-[0_20px_80px_-30px_rgba(0,0,0,0.18)] overflow-hidden">
									<div className="h-2 w-full bg-[#f05a28]" />
									<div className="p-7 md:p-10">
										<div className="flex items-center gap-4 mb-8">
											<div className="w-16 h-16 rounded-3xl bg-orange-50 text-[#f05a28] flex items-center justify-center">
												<UserCircle2 size={32} />
											</div>
											<div>
												<p className="text-[10px] font-black text-[#f05a28] uppercase tracking-[0.3em] mb-2">
													Voter Information
												</p>
												<h2 className="text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-tighter italic">
													Fill Up the Form
												</h2>
											</div>
										</div>

										<div className="mb-8 rounded-[2rem] border border-orange-100 bg-gradient-to-br from-orange-50 to-white p-5 md:p-6 shadow-sm">
											<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
												<div>
													<p className="text-[10px] font-black text-[#f05a28] uppercase tracking-[0.3em] mb-2">
														Logged-in voter
													</p>
													<p className="text-sm text-gray-500 leading-6 max-w-2xl">
														Your account details are loaded from your current session. You can hide your name for privacy, but your ID stays tied to the verified voter record.
													</p>
												</div>

												<button
													type="button"
													onClick={() =>
														setFormData((prev) => ({
															...prev,
															hideName: !prev.hideName,
														}))
													}
													className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white border border-gray-200 text-xs font-black uppercase tracking-tight hover:border-[#f05a28]/30 hover:text-[#f05a28] transition-all shadow-sm"
												>
													{formData.hideName ? <Eye size={16} /> : <EyeOff size={16} />}
													{formData.hideName ? "Show Name" : "Hide Name"}
												</button>
											</div>

											<div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
												<div className="rounded-[1.7rem] border border-gray-100 bg-white px-5 py-4 shadow-[0_10px_30px_-24px_rgba(0,0,0,0.25)]">
													<p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] mb-2">
														Name
													</p>
													<p className="text-lg font-black text-gray-900 uppercase tracking-tight">
														{isLoadingIdentity ? "Loading..." : formData.hideName ? "Anonymous Voter" : formData.name}
													</p>
													<p className="mt-1 text-sm text-gray-500 font-medium">
														Prefilled from your login session
													</p>
												</div>

												<div className="rounded-[1.7rem] border border-gray-100 bg-white px-5 py-4 shadow-[0_10px_30px_-24px_rgba(0,0,0,0.25)]">
													<p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] mb-2">
														ID Number
													</p>
													<p className="text-lg font-black text-gray-900 uppercase tracking-tight">
														{isLoadingIdentity ? "Loading..." : formData.idNumber}
													</p>
													<p className="mt-1 text-sm text-gray-500 font-medium">
														Linked to the authenticated session
													</p>
												</div>
											</div>
										</div>

										<div className="grid grid-cols-1 gap-6">
											<div className="rounded-[1.8rem] border border-gray-100 bg-white p-5 md:p-6 shadow-sm">
												<label className="block text-[11px] font-black text-gray-500 uppercase tracking-[0.25em] mb-3">
													Section
												</label>
												<input
													type="text"
													value={formData.section}
													onChange={(e) =>
														setFormData((prev) => ({
															...prev,
															section: e.target.value,
														}))
													}
													className="w-full h-16 px-5 rounded-[1.4rem] border border-gray-200 bg-white outline-none focus:border-[#f05a28] text-gray-900 font-semibold"
													placeholder="Enter your section / block"
												/>
												{formErrors.section ? (
													<p className="mt-2 text-sm text-red-500 font-medium">{formErrors.section}</p>
												) : null}
												<p className="mt-2 text-sm text-gray-500">
													Type your current section or block here.
												</p>
											</div>
											{formErrors.idNumber ? (
												<p className="text-sm text-red-500 font-medium">{formErrors.idNumber}</p>
											) : null}
										</div>

										<div className="mt-8 rounded-[1.8rem] border border-gray-100 bg-gray-50 p-5">
											<div className="flex items-start gap-4">
												<div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 text-[#f05a28] flex items-center justify-center shrink-0">
													<ShieldCheck size={22} />
												</div>
												<div>
													<p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.25em] mb-2">
														Confirmation
													</p>
													<p className="text-sm text-gray-600 leading-7">
														By continuing, you confirm that the voter information provided is
														correct and will be used for CET election verification before showing
														the candidate list.
													</p>
												</div>
											</div>
										</div>

										<div className="mt-8 flex justify-end">
											<button
												onClick={handleContinueToBallot}
												disabled={isLoadingIdentity || !formData.idNumber}
												className="px-8 py-4 rounded-2xl bg-[#111] text-white font-black uppercase tracking-tight hover:bg-[#f05a28] transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
											>
												Next <ArrowRight size={18} />
											</button>
										</div>
									</div>
								</div>
							</motion.div>
						)}
					</div>
				</>
			)}

			<AnimatePresence>
				{showSummary && step === "ballot" && (
					<>
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							onClick={() => setShowSummary(false)}
							className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[120]"
						/>
						<motion.div
							initial={{ x: "100%" }}
							animate={{ x: 0 }}
							exit={{ x: "100%" }}
							className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-[130] shadow-2xl p-8 overflow-y-auto"
						>
							<div className="flex items-center justify-between mb-10">
								<h4 className="text-2xl font-black italic uppercase tracking-tighter text-gray-900">
									Ballot Summary
								</h4>
								<button
									onClick={() => setShowSummary(false)}
									className="p-2 hover:bg-gray-50 rounded-full"
								>
									<X size={24} />
								</button>
							</div>

							<div className="mb-6 rounded-2xl border border-gray-100 bg-gray-50 p-4">
								<p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] mb-2">
									Voter
								</p>
								<p className="text-sm font-black text-gray-900 uppercase tracking-tight">
									{formData.hideName ? "Anonymous Voter" : formData.name}
								</p>
								<p className="text-sm text-gray-500 font-medium">
									{formData.idNumber} • {formData.section}
								</p>
							</div>

							<div className="space-y-4">
								{POSITIONS.map((pos) => (
									<div
										key={pos}
										className="p-4 rounded-2xl border border-gray-100 flex justify-between items-center group hover:border-[#f05a28]/30 transition-all"
									>
										<span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
											{pos}
										</span>
										<span
											className={`text-xs font-black ${
												selectedCandidates[pos] ? "text-gray-900" : "text-red-400"
											}`}
										>
											{selectedCandidates[pos] === "abstain"
												? "ABSTAINED"
												: selectedCandidates[pos]
												? "SELECTION MADE"
												: "PENDING"}
										</span>
									</div>
								))}
							</div>
						</motion.div>
					</>
				)}

				{isConfirming && step === "ballot" && (
					<div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="absolute inset-0 bg-black/80 backdrop-blur-xl"
						/>
						<motion.div
							initial={{ scale: 0.9, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							className="relative w-full max-w-xl bg-white rounded-[3rem] p-12 overflow-hidden"
						>
							<div className="absolute top-0 left-0 w-full h-2 bg-[#f05a28]" />
							<div className="text-center">
								<div className="w-20 h-20 bg-orange-50 text-[#f05a28] rounded-3xl flex items-center justify-center mx-auto mb-6">
									<Fingerprint size={40} />
								</div>

								<h3 className="text-3xl font-black text-gray-900 italic uppercase mb-4">
									Confirm Selection
								</h3>

								<p className="text-gray-500 font-medium mb-5">
									By confirming, you verify that these choices are your own. This action is
									encrypted and irreversible.
								</p>

								<div className="rounded-2xl border border-gray-100 bg-gray-50 p-4 mb-8 text-left">
									<p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] mb-2">
										Verified Voter
									</p>
									<p className="text-sm font-black text-gray-900 uppercase tracking-tight">
										{formData.hideName ? "Anonymous Voter" : formData.name}
									</p>
									<p className="text-sm text-gray-500 font-medium">
										{formData.idNumber} • {formData.section}
									</p>
								</div>

								<div className="flex flex-col gap-4">
									<button
										disabled={submitting}
										onClick={finalSubmit}
										className="w-full bg-[#111] text-white h-16 rounded-2xl font-black uppercase tracking-tighter hover:bg-[#f05a28] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
									>
										{submitting ? (
											<RefreshCcw className="animate-spin" />
										) : (
											<>
												<Lock size={18} /> Cast Secure Vote
											</>
										)}
									</button>

									<button
										onClick={() => setIsConfirming(false)}
										className="w-full h-16 rounded-2xl font-black uppercase tracking-tighter text-gray-400 hover:text-gray-900 transition-all"
									>
										Cancel
									</button>
								</div>
							</div>
						</motion.div>
					</div>
				)}
			</AnimatePresence>
		</main>
	);
}
