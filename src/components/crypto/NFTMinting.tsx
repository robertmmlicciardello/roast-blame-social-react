
import React, { useState } from 'react';
import { Sparkles, Upload, Eye, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

interface NFTMintingProps {
  postId: string;
  postContent: string;
  postImage?: string;
  creatorId: string;
  onMintSuccess: (nftData: any) => void;
}

export const NFTMinting: React.FC<NFTMintingProps> = ({
  postId,
  postContent,
  postImage,
  creatorId,
  onMintSuccess
}) => {
  const { user, isAdmin } = useAuth();
  const [showMintModal, setShowMintModal] = useState(false);
  const [nftMetadata, setNftMetadata] = useState({
    name: '',
    description: '',
    price: 0.01,
    royalty: 10,
    collection: 'RoastBlame Exclusives'
  });
  const [isMinting, setIsMinting] = useState(false);
  const [mintingStep, setMintingStep] = useState<'prepare' | 'upload' | 'mint' | 'success'>('prepare');

  const handleMintNFT = async () => {
    if (!isAdmin) {
      toast({
        title: "Admin Only",
        description: "Only administrators can mint NFTs",
        variant: "destructive"
      });
      return;
    }

    setIsMinting(true);
    setMintingStep('upload');

    try {
      // Step 1: Upload metadata to IPFS (simulated)
      const metadata = {
        name: nftMetadata.name,
        description: nftMetadata.description,
        image: postImage || 'https://via.placeholder.com/400x400?text=RoastBlame+NFT',
        attributes: [
          { trait_type: 'Post ID', value: postId },
          { trait_type: 'Creator', value: creatorId },
          { trait_type: 'Platform', value: 'RoastBlame' },
          { trait_type: 'Rarity', value: 'Exclusive' }
        ],
        external_url: `https://roastblame.com/post/${postId}`
      };

      // Simulate IPFS upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      const ipfsHash = 'QmX' + Math.random().toString(36).substr(2, 40);
      
      setMintingStep('mint');
      
      // Step 2: Mint NFT on blockchain (simulated)
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const nftData = {
        id: 'nft_' + Math.random().toString(36).substr(2, 9),
        tokenId: Math.floor(Math.random() * 10000) + 1,
        contractAddress: '0x' + Math.random().toString(16).substr(2, 40),
        metadata: metadata,
        ipfsHash: ipfsHash,
        mintedBy: user?.uid,
        mintedAt: new Date(),
        price: nftMetadata.price,
        royalty: nftMetadata.royalty,
        status: 'minted'
      };

      // Save NFT data
      const existingNFTs = JSON.parse(localStorage.getItem('roastblame_nfts') || '[]');
      existingNFTs.push(nftData);
      localStorage.setItem('roastblame_nfts', JSON.stringify(existingNFTs));

      setMintingStep('success');
      onMintSuccess(nftData);
      
      toast({
        title: "NFT Minted Successfully!",
        description: `Token ID: ${nftData.tokenId} has been created`
      });

      setTimeout(() => {
        setShowMintModal(false);
        setIsMinting(false);
        setMintingStep('prepare');
      }, 3000);

    } catch (error) {
      console.error('NFT minting error:', error);
      setIsMinting(false);
      setMintingStep('prepare');
      toast({
        title: "Minting Failed",
        description: "Failed to mint NFT. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <>
      <button
        onClick={() => setShowMintModal(true)}
        className="flex items-center space-x-1 text-purple-400 hover:text-purple-300 transition-colors"
        title="Mint as NFT"
      >
        <Sparkles className="h-4 w-4" />
        <span className="text-sm">Mint NFT</span>
      </button>

      {showMintModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl max-w-lg w-full p-6 border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">Mint NFT</h3>
              <button 
                onClick={() => setShowMintModal(false)}
                className="text-gray-400 hover:text-white"
                disabled={isMinting}
              >
                ✕
              </button>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-6">
              {['prepare', 'upload', 'mint', 'success'].map((step, index) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    mintingStep === step 
                      ? 'bg-purple-600 text-white' 
                      : index < ['prepare', 'upload', 'mint', 'success'].indexOf(mintingStep)
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-600 text-gray-400'
                  }`}>
                    {index + 1}
                  </div>
                  {index < 3 && (
                    <div className={`w-8 h-0.5 mx-2 ${
                      index < ['prepare', 'upload', 'mint', 'success'].indexOf(mintingStep)
                        ? 'bg-green-600'
                        : 'bg-gray-600'
                    }`} />
                  )}
                </div>
              ))}
            </div>

            {mintingStep === 'prepare' && (
              <div className="space-y-4">
                {/* NFT Preview */}
                <div className="bg-gray-800 rounded-lg p-4">
                  <h4 className="text-white font-medium mb-2">NFT Preview</h4>
                  <div className="flex space-x-4">
                    {postImage && (
                      <img 
                        src={postImage} 
                        alt="NFT" 
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <p className="text-gray-300 text-sm line-clamp-3">{postContent}</p>
                    </div>
                  </div>
                </div>

                {/* NFT Details Form */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-white font-medium mb-2">NFT Name</label>
                    <input
                      type="text"
                      value={nftMetadata.name}
                      onChange={(e) => setNftMetadata(prev => ({...prev, name: e.target.value}))}
                      placeholder="Epic Roast Collection #1"
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">Description</label>
                    <textarea
                      value={nftMetadata.description}
                      onChange={(e) => setNftMetadata(prev => ({...prev, description: e.target.value}))}
                      placeholder="A hilarious roast that became legendary on RoastBlame..."
                      rows={3}
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white font-medium mb-2">Price (ETH)</label>
                      <input
                        type="number"
                        step="0.001"
                        value={nftMetadata.price}
                        onChange={(e) => setNftMetadata(prev => ({...prev, price: parseFloat(e.target.value)}))}
                        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-white font-medium mb-2">Royalty (%)</label>
                      <input
                        type="number"
                        value={nftMetadata.royalty}
                        onChange={(e) => setNftMetadata(prev => ({...prev, royalty: parseInt(e.target.value)}))}
                        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {mintingStep === 'upload' && (
              <div className="text-center py-8">
                <Upload className="h-16 w-16 text-purple-400 mx-auto mb-4 animate-bounce" />
                <h4 className="text-white font-bold mb-2">Uploading to IPFS</h4>
                <p className="text-gray-400">Uploading metadata and media files...</p>
              </div>
            )}

            {mintingStep === 'mint' && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-400 mx-auto mb-4"></div>
                <h4 className="text-white font-bold mb-2">Minting NFT</h4>
                <p className="text-gray-400">Creating your NFT on the blockchain...</p>
              </div>
            )}

            {mintingStep === 'success' && (
              <div className="text-center py-8">
                <Sparkles className="h-16 w-16 text-green-400 mx-auto mb-4" />
                <h4 className="text-white font-bold mb-2">NFT Minted Successfully!</h4>
                <p className="text-gray-400">Your NFT is now available on the marketplace</p>
              </div>
            )}

            {/* Action Buttons */}
            {mintingStep === 'prepare' && (
              <div className="space-y-3 mt-6">
                <Button
                  onClick={handleMintNFT}
                  disabled={!nftMetadata.name || !nftMetadata.description}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Mint NFT
                </Button>
                
                <Button 
                  onClick={() => setShowMintModal(false)} 
                  variant="outline" 
                  className="w-full"
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
