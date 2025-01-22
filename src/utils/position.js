export const PositionUtils = {
    getRandomInRange: (range) => Math.random() * range - range/2,
    
    calculateDistance: (pos1, pos2) => 
      Math.sqrt(
        Math.pow(pos1[0] - pos2[0], 2) +
        Math.pow(pos1[1] - pos2[1], 2) +
        Math.pow(pos1[2] - pos2[2], 2)
      ),
      
    generateValidPosition: (existingPositions, range = 200, minDistance = 50, maxAttempts = 100) => {
      let attempts = 0;
      while (attempts < maxAttempts) {
        const position = [
          PositionUtils.getRandomInRange(range),
          PositionUtils.getRandomInRange(range),
          PositionUtils.getRandomInRange(range)
        ];
  
        const isValid = existingPositions.every(existingPos => 
          PositionUtils.calculateDistance(position, existingPos) >= minDistance
        );

        // console.log(position)
  
        if (isValid) return position;
        attempts++;
      }
      console.warn('Could not find valid position after max attempts');
      return [0, 0, 0]; // Fallback position

    }
  };