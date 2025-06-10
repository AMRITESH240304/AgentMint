// import React, { useState, useRef, useEffect } from 'react';
// import type { AIAgent } from '../types/agent';
// import { ArrowLeft, Coins, Info, CheckCircle, XCircle, Hammer } from 'lucide-react';

// interface BidScreenProps {
//   agent: AIAgent;
//   onBack: () => void;
//   onPlaceBid: (agentId: string, bidAmount: number) => Promise<boolean>; // Returns true if bid is successful
// }

// export default function BidScreen({ agent, onBack, onPlaceBid }: BidScreenProps) {
//   const [bidAmount, setBidAmount] = useState<string>('');
//   const [isBidding, setIsBidding] = useState(false);
//   const [bidStatus, setBidStatus] = useState<'idle' | 'success' | 'error'>('idle');
//   const [errorMessage, setErrorMessage] = useState<string | null>(null);
//   const [showHammerAnimation, setShowHammerAnimation] = useState(false);
  
//   const currentHighestBid = agent.price; // Assuming agent.price is the current highest bid

//   const handlePlaceBid = async () => {
//     if (!bidAmount || parseFloat(bidAmount) <= currentHighestBid) {
//       setErrorMessage(`Your bid must be higher than the current highest bid of ${currentHighestBid} ETH.`);
//       setBidStatus('error');
//       return;
//     }
    
//     // Start the hammer animation
//     setShowHammerAnimation(true);
    
//     // Delay the actual bid processing to let the animation play
//     setTimeout(async () => {
//       setIsBidding(true);
//       setErrorMessage(null);
//       try {
//         const success = await onPlaceBid(agent.id, parseFloat(bidAmount));
//         if (success) {
//           setBidStatus('success');
//         } else {
//           setBidStatus('error');
//           setErrorMessage('Bid placement failed. Please try again.');
//         }
//       } catch (error) {
//         setBidStatus('error');
//         setErrorMessage('An unexpected error occurred. Please try again.');
//         console.error('Bid placement error:', error);
//       }
//       setIsBidding(false);
      
//       // Hide hammer animation after 1.5 seconds
//       setTimeout(() => {
//         setShowHammerAnimation(false);
//       }, 1500);
//     }, 1000); // Delay bid processing by 1 second to show animation
//   };

//   return (
//     <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
//       <div className="bg-gray-900 border border-purple-500 rounded-2xl shadow-2xl w-full max-w-4xl relative overflow-hidden">
//         {/* Hammer Animation */}
//         {showHammerAnimation && (
//           <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50 backdrop-blur-sm">
//             <div className="relative">
//               <Hammer 
//                 size={120} 
//                 className="text-amber-500 animate-hammer-fall"
//                 style={{
//                   filter: "drop-shadow(0 0 20px rgba(245, 158, 11, 0.5))",
//                 }}
//               />
//               <div className="absolute top-[80%] left-1/2 transform -translate-x-1/2 w-24 h-1 bg-amber-500/50 rounded-full animate-hammer-impact"></div>
//               <span className="absolute top-[120%] left-1/2 transform -translate-x-1/2 text-3xl font-bold text-amber-500 animate-bid-text">BID PLACED!</span>
//             </div>
//           </div>
//         )}

//         {/* Header with Back Button */}
//         <div className="p-6 border-b border-gray-700 flex justify-between items-center">
//           <button
//             onClick={onBack}
//             className="flex items-center text-gray-300 hover:text-cyan-400 transition-colors duration-300 text-sm"
//           >
//             <ArrowLeft className="h-4 w-4 mr-2" />
//             Back to Auctions
//           </button>
//           <h2 className="text-2xl font-bold text-white">Bid on {agent.name}</h2>
//         </div>

//         <div className="p-6 md:p-8 grid md:grid-cols-2 gap-8">
//           {/* Left Column: Agent Info & Try Area */}
//           <div className="flex flex-col space-y-6">
//             <div className="relative aspect-square w-full max-w-sm mx-auto bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
//               <img
//                 src={agent.avatar}
//                 alt={agent.name}
//                 className="w-full h-full object-cover"
//               />
//               <div className="absolute top-3 left-3 px-2 py-1 bg-purple-600/80 backdrop-blur-sm rounded-full text-xs font-medium text-white">
//                 {agent.category}
//               </div>
//             </div>

//             <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
//               <h3 className="text-lg font-semibold text-white mb-2">Try the agent before bidding?</h3>
//               <div className="h-40 bg-gray-700 rounded flex items-center justify-center text-gray-500 text-sm">
//                 A space to try the AI agent a person is going to bid for
//               </div>
//             </div>
//           </div>

//           {/* Right Column: Bidding Interface */}
//           <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 flex flex-col justify-between">
//             <div>
//               <div className="mb-4">
//                 <p className="text-sm text-gray-400">Estimate $2,000 - $2,200</p>
//                 <p className="text-xs text-gray-500">Jun 14, 2025, 7:30 PM GMT+5:30</p>
//               </div>

//               <div className="mb-6">
//                 <p className="text-sm text-gray-400">Starting Price</p>
//                 <p className="text-4xl font-bold text-white">${(currentHighestBid * 100).toFixed(0)}</p> {/* Assuming 1 ETH = $100 for display, adjust as needed */}
//                 <p className="text-xs text-gray-400">or 4 payments starting at $25.00 with Zip <Info size={12} className="inline"/></p>
//               </div>

//               <div className="mb-6">
//                 <label htmlFor="bidAmount" className="block text-sm font-semibold text-gray-300 mb-1">
//                   SET YOUR MAX BID <Info size={12} className="inline text-gray-400"/>
//                 </label>
//                 <div className="relative">
//                   <input
//                     type="number"
//                     id="bidAmount"
//                     value={bidAmount}
//                     onChange={(e) => {
//                       setBidAmount(e.target.value);
//                       setBidStatus('idle');
//                       setErrorMessage(null);
//                     }}
//                     placeholder={`> ${currentHighestBid} ETH`}
//                     className="w-full pl-3 pr-10 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-lg"
//                     min={(currentHighestBid + 0.00000001).toString()} // Small increment for min value
//                     step="0.01"
//                     disabled={isBidding || bidStatus === 'success'}
//                   />
//                   <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">ETH</span>
//                 </div>
//               </div>

//               {bidStatus === 'error' && errorMessage && (
//                 <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-400 text-sm flex items-center">
//                   <XCircle size={18} className="mr-2" /> {errorMessage}
//                 </div>
//               )}

//               {bidStatus === 'success' && (
//                 <div className="mb-4 p-3 bg-green-500/20 border border-green-500 rounded-lg text-green-400 text-sm flex items-center">
//                   <CheckCircle size={18} className="mr-2" /> Bid placed successfully!
//                 </div>
//               )}
//             </div>

//             <div className="mt-auto">
//               <button
//                 onClick={handlePlaceBid}
//                 disabled={isBidding || bidStatus === 'success' || !bidAmount}
//                 className="w-full py-3.5 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg font-semibold text-white hover:from-red-600 hover:to-orange-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-lg"
//               >
//                 {isBidding ? (
//                   <>
//                     <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                     </svg>
//                     Placing Bid...
//                   </>
//                 ) : bidStatus === 'success' ? (
//                   <>
//                     <CheckCircle size={20} className="mr-2" /> Bid Placed!
//                   </>
//                 ) : (
//                   <>
//                     <Hammer size={20} className="mr-2" /> Place Bid
//                   </>
//                 )}
//               </button>
//               <p className="text-xs text-gray-500 mt-3 text-center">Get approved to bid. <a href="#" className="text-cyan-400 hover:underline">Register for Auction</a></p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }