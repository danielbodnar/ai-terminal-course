import chalk from 'chalk';
import Table from 'cli-table3';
import figlet from 'figlet';
import gradient from 'gradient-string';

export function clearScreen() {
  console.clear();
}

export function showHeader(title, subtitle = '') {
  console.log('\n');
  console.log(gradient.pastel.multiline(figlet.textSync(title, {
    font: 'Standard',
    horizontalLayout: 'default'
  })));

  if (subtitle) {
    console.log(chalk.gray(subtitle));
  }
  console.log('\n');
}

export function showBox(title, content, width = 60) {
  const topBorder = '┌' + '─'.repeat(width - 2) + '┐';
  const bottomBorder = '└' + '─'.repeat(width - 2) + '┘';
  const separator = '├' + '─'.repeat(width - 2) + '┤';

  console.log(chalk.cyan(topBorder));

  if (title) {
    const paddedTitle = ` ${title}`.padEnd(width - 2);
    console.log(chalk.cyan('│') + chalk.bold(paddedTitle) + chalk.cyan('│'));
    console.log(chalk.cyan(separator));
  }

  const lines = content.split('\n');
  lines.forEach(line => {
    const paddedLine = ` ${line}`.padEnd(width - 2);
    console.log(chalk.cyan('│') + paddedLine + chalk.cyan('│'));
  });

  console.log(chalk.cyan(bottomBorder));
  console.log('');
}

export function showTokenTable(tokens) {
  const table = new Table({
    head: [
      chalk.cyan('#'),
      chalk.cyan('Token'),
      chalk.cyan('ID'),
      chalk.cyan('Bytes')
    ],
    style: {
      head: [],
      border: ['cyan']
    }
  });

  tokens.forEach((token, idx) => {
    const bytesPreview = token.bytes.length > 3
      ? `[${token.bytes.slice(0, 3).join(',')}...]`
      : `[${token.bytes.join(',')}]`;

    table.push([
      chalk.white(idx + 1),
      chalk.yellow(token.text),
      chalk.gray(token.id),
      chalk.gray(bytesPreview)
    ]);
  });

  console.log(table.toString());
}

export function showProgress(current, total) {
  const percentage = Math.floor((current / total) * 100);
  const filled = Math.floor((current / total) * 20);
  const empty = 20 - filled;

  const bar = '█'.repeat(filled) + '░'.repeat(empty);

  console.log(chalk.cyan(`\nProgress: ${bar} ${percentage}%`));
  console.log(chalk.gray(`Module ${current}/${total}\n`));
}

export function showInsight(text) {
  console.log(chalk.blue('💡 ') + chalk.italic(text));
  console.log('');
}

export function showSuccess(text) {
  console.log(chalk.green('✓ ') + chalk.green(text));
}

export function showError(text) {
  console.log(chalk.red('✗ ') + chalk.red(text));
}

export function showCost(tokens, model = 'gpt-4o-mini') {
  // Pricing per 1M tokens (as of 2025)
  const pricing = {
    'gpt-4o-mini': { input: 0.15, output: 0.60 },
    'gpt-4o': { input: 2.50, output: 10.00 },
    'gpt-4': { input: 30.00, output: 60.00 }
  };

  const prices = pricing[model] || pricing['gpt-4o-mini'];
  const cost = (tokens / 1_000_000) * prices.input;

  console.log(chalk.gray(`Cost @ ${model}: ${chalk.yellow('$' + cost.toFixed(6))}`));
  console.log('');
}

export async function pause(message = 'Press Enter to continue...') {
  const inquirer = (await import('inquirer')).default;
  await inquirer.prompt([{
    type: 'input',
    name: 'continue',
    message: chalk.gray(message),
  }]);
}

export async function askYesNo(question) {
  const inquirer = (await import('inquirer')).default;
  const answer = await inquirer.prompt([{
    type: 'confirm',
    name: 'response',
    message: question,
    default: true
  }]);
  return answer.response;
}

export async function getInput(prompt, defaultValue = '') {
  const inquirer = (await import('inquirer')).default;
  const answer = await inquirer.prompt([{
    type: 'input',
    name: 'value',
    message: prompt,
    default: defaultValue
  }]);
  return answer.value;
}

export function showStats(stats) {
  const table = new Table({
    head: [chalk.cyan('Metric'), chalk.cyan('Value')],
    style: {
      head: [],
      border: ['cyan']
    }
  });

  Object.entries(stats).forEach(([key, value]) => {
    table.push([chalk.white(key), chalk.yellow(value)]);
  });

  console.log(table.toString());
  console.log('');
}

export function showChallenge(title, description) {
  showBox('CHALLENGE: ' + title, description, 60);
}

export function showStars(count) {
  const stars = '⭐'.repeat(count);
  const empty = '☆'.repeat(3 - count);
  console.log(chalk.yellow(stars + empty));
  console.log('');
}
