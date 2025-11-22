const Wallet = require('../models/Wallet');

const getWalletData = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const wallet = await Wallet.findByUserId(userId);
    const transactions = await Wallet.getTransactionsByUserId(userId);

    res.json({
      success: true,
      message: 'Wallet data retrieved successfully',
      data: {
        balance: wallet ? wallet.balance : 0,
        transactions: transactions,
      },
    });

  } catch (error) {
    console.error('Get wallet data error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve wallet data',
      error: error.message,
    });
  }
};

module.exports = {
  getWalletData,
};
