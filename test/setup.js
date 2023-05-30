export default () => {
    process.argv = ["node", "src/main.js", "YOUR_ORGANIZATION"];
    process.env.GITHUB_KEY = "YOUR_GITHUB_KEY";
};