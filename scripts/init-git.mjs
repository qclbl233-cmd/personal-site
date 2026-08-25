// scripts/init-git.mjs
// 一键初始化 Git 仓库并推送到 GitHub
// 用法: npm run git-init -- https://github.com/你的用户名/仓库名.git
import { execSync } from "node:child_process";

const repoUrl = process.argv[2];
if (!repoUrl) {
  console.error("❌ 用法: npm run git-init -- <仓库URL>");
  console.error("   例: npm run git-init -- https://github.com/qclbl233-cmd/my-vibe-blog.git");
  process.exit(1);
}

const run = (cmd, { quiet = false } = {}) => {
  console.log(`\n> ${cmd}`);
  execSync(cmd, { stdio: quiet ? "pipe" : "inherit" });
};

try {
  // 0. 检查是否已是 git 仓库
  try {
    execSync("git rev-parse --git-dir", { stdio: "pipe" });
    console.log("ℹ️  已存在 .git 仓库，跳过 git init");
  } catch {
    run("git init");
  }

  // 1. 确定分支名（GitHub 默认 main）
  let branch = "main";
  try {
    branch = execSync("git branch --show-current").toString().trim() || "main";
  } catch {
    run("git branch -M main", { quiet: true });
  }
  if (!branch || branch === "HEAD") branch = "main";

  // 2. 添加并提交（若已有提交则跳过）
  run("git add .");
  try {
    run('git commit -m "init: Sunshine\'s Space 个人博客"', { quiet: true });
  } catch {
    console.log("ℹ️  没有新的改动需要提交");
  }

  // 3. 添加远程仓库
  try {
    run(`git remote add origin ${repoUrl}`);
  } catch {
    console.log("ℹ️  remote origin 已存在，使用现有配置");
  }

  // 4. 推送
  run(`git push -u origin ${branch}`);

  console.log(`\n✅ 上传完成！仓库: ${repoUrl}（分支 ${branch}）`);
} catch (e) {
  console.error("\n❌ 出错了：");
  console.error(e.stderr?.toString() || e.message);
  console.error("\n提示：确认已先在 GitHub 创建空仓库，并已配置 git 登录（git config --global user.name / user.email）");
  process.exit(1);
}
