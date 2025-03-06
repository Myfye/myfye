function calculateBasisPoints(fee: number, totalAmount: number): number {
    if (totalAmount === 0) {
        throw new Error("Total amount cannot be zero.");
    }

    const basisPoints = (fee / totalAmount) * 10000;
    return parseFloat(basisPoints.toFixed(2));
}

export default calculateBasisPoints;