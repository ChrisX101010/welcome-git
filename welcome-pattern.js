const simpleGit = require('simple-git');
const fs = require('fs').promises;
const git = simpleGit();

// 3x5 pixel font for letters, digits, and space
const FONT = {
  'W': [
    [1, 0, 1],
    [1, 0, 1],
    [1, 1, 1],
    [1, 0, 1],
    [1, 0, 1]
  ],
  'E': [
    [1, 1, 1],
    [1, 0, 0],
    [1, 1, 1],
    [1, 0, 0],
    [1, 1, 1]
  ],
  'L': [
    [1, 0, 0],
    [1, 0, 0],
    [1, 0, 0],
    [1, 0, 0],
    [1, 1, 1]
  ],
  'C': [
    [1, 1, 1],
    [1, 0, 0],
    [1, 0, 0],
    [1, 0, 0],
    [1, 1, 1]
  ],
  'O': [
    [1, 1, 1],
    [1, 0, 1],
    [1, 0, 1],
    [1, 0, 1],
    [1, 1, 1]
  ],
  'M': [
    [1, 0, 1],
    [1, 1, 1],
    [1, 0, 1],
    [1, 0, 1],
    [1, 0, 1]
  ],
  'T': [
    [1, 1, 1],
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0]
  ],
  ' ': [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]
  ],
  'Y': [
    [1, 0, 1],
    [1, 0, 1],
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0]
  ],
  'P': [
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 1],
    [1, 0, 0],
    [1, 0, 0]
  ],
  'R': [
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 1],
    [1, 0, 1],
    [1, 0, 1]
  ],
  'F': [
    [1, 1, 1],
    [1, 0, 0],
    [1, 1, 1],
    [1, 0, 0],
    [1, 0, 0]
  ],
  'I': [
    [1, 1, 1],
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
    [1, 1, 1]
  ]
};

// Message to display
const MESSAGE = [
  "WELCOME TO", // Line 1 (10 characters)
  "MY PROFILE"  // Line 2 (9 characters)
];

// Start date for the pattern
const START_DATE = new Date('2024-05-09T00:00:00Z');

async function generateCommits() {
  try {
    // Initialize repository
    await fs.writeFile('pattern.txt', '# Pattern commits for WELCOME TO MY PROFILE\n');
    await git.add('pattern.txt');
    await git.commit('Initial commit', { '--date': START_DATE.toISOString() });

    // Process each line of the message
    for (let lineIdx = 0; lineIdx < MESSAGE.length; lineIdx++) {
      const line = MESSAGE[lineIdx];
      const yOffset = lineIdx === 0 ? 0 : 3; // Rows 0-2 for first line, 3-5 for second

      // Process each character in the line
      for (let charIdx = 0; charIdx < line.length; charIdx++) {
        const char = line[charIdx];
        const pattern = FONT[char] || FONT[' '];
        const xOffset = charIdx * 4; // 3 columns per letter + 1 for spacing

        // Process each pixel in the 3x5 pattern
        for (let row = 0; row < 5; row++) {
          for (let col = 0; col < 3; col++) {
            if (pattern[row][col] === 1) {
              // Calculate date for this pixel
              const daysOffset = (yOffset + row) + (xOffset + col) * 7;
              const commitDate = new Date(START_DATE);
              commitDate.setDate(START_DATE.getDate() + daysOffset);
              const isoDate = commitDate.toISOString();

              // Log commit for debugging
              console.log(`Creating commit for ${char} at row ${yOffset + row}, col ${xOffset + col} on ${isoDate}`);

              // Create commit
              await fs.appendFile('pattern.txt', `Pixel at row ${yOffset + row}, col ${xOffset + col} for ${char} on ${isoDate}\n`);
              await git.add('pattern.txt');
              await git.commit(`Commit for ${char} at (${yOffset + row}, ${xOffset + col})`, {
                '--date': isoDate
              });
            }
          }
        }
      }
    }

    console.log('Commits generated successfully.');
  } catch (err) {
    console.error('Error generating commits:', err);
  }
}

generateCommits();