// import type { Config } from "tailwindcss";

// const {
//   default: flattenColorPalette,
// } = require("tailwindcss/lib/util/flattenColorPalette");


// const config: Config = {
//   content: [
//     "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
//     "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
//     "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
//   ],
//   darkMode:'class',

//   theme: {
//     extend: {
//       animation: {
//         spotlight: "spotlight 2s ease .75s 1 forwards",
//         aurora: "aurora 60s linear infinite",

//       },
//       keyframes: {
//         spotlight: {
//           "0%": {
//             opacity: 0,
//             transform: "translate(-72%, -62%) scale(0.5)",
//           },
//           "100%": {
//             opacity: 1,
//             transform: "translate(-50%,-40%) scale(1)",
//           },
//         },
//       },

//       boxShadow: {
//         input: `10px 20px 30px 100px rgba(0,0,0,0.1), 10px 10px 10px 10px rgba(25,28,33,0.02), 10px 10px 10px 100px rgba(25,28,33,0.08)`,
//       },

//       backgroundImage: {
//         "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
//         "gradient-conic":
//           "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
//       },
//       animation: {
//         aurora: "aurora 60s linear infinite",

//       },
//       keyframes: {
//         aurora: {
//           from: {
//             backgroundPosition: "50% 50%, 50% 50%",
//           },
//           to: {
//             backgroundPosition: "350% 50%, 350% 50%",
//           },
//         },
//       },


//     },
//   },
//   plugins: [addVariablesForColors],
// };
// function addVariablesForColors({ addBase, theme }: any) {
//   let allColors = flattenColorPalette(theme("colors"));
//   let newVars = Object.fromEntries(
//     Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
//   );
 
//   addBase({
//     ":root": newVars,
//   });
// }

// export default config;

import type { Config } from "tailwindcss";
const { default: flattenColorPalette } = require("tailwindcss/lib/util/flattenColorPalette");

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',

  theme: {
    extend: {
      animation: {
        spotlight: "spotlight 2s ease .75s 1 forwards",
        aurora: "aurora 60s linear infinite",
      },
      keyframes: {
        spotlight: {
          "0%": {
            opacity: 0,
            transform: "translate(-72%, -62%) scale(0.5)",
          },
          "100%": {
            opacity: 1,
            transform: "translate(-50%,-40%) scale(1)",
          },
        },
        aurora: {
          from: {
            backgroundPosition: "50% 50%, 50% 50%",
          },
          to: {
            backgroundPosition: "350% 50%, 350% 50%",
          },
        },
      },

      boxShadow: {
        input: `10px 20px 30px 100px rgba(0,0,0,0.1), 10px 10px 10px 10px rgba(25,28,33,0.02), 10px 10px 10px 100px rgba(25,28,33,0.08)`,
      },

      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },

  plugins: [addVariablesForColors],
};

function addVariablesForColors({ addBase, theme }: any) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );
 
  addBase({
    ":root": newVars,
  });
}

export default config;
