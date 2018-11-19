const commands = [require('./clear'), require('./version'), require('./watch')];

export default {
  async run(options) {
    try {
      console.log(options);
      const runnable = commands.filter((c) => c.trigger(options));
      const result = await Promise.all(runnable.map((c) => c.run(options)));
      const results = result.join('\n');

      return { exitCode: 0, result: results };
    } catch (error) {
      return { exitCode: 1, result: error };
    }
  },
};
