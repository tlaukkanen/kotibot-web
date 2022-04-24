namespace KotibotWeb.Controllers
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using KotibotWeb.Data;
    using KotibotWeb.Model;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.EntityFrameworkCore;
  using Microsoft.Extensions.Configuration;
  using Microsoft.Extensions.Logging;

    [ApiController]
    [Route("[controller]")]
    public class MeasurementsController : ControllerBase
    {
        private readonly ILogger<MeasurementsController> logger;
        private readonly ApplicationDbContext context;
        private readonly IConfiguration configuration;

        public MeasurementsController(
            ILogger<MeasurementsController> logger,
            ApplicationDbContext context,
            IConfiguration configuration)
        {
            this.logger = logger;
            this.context = context;
            this.configuration = configuration;
        }

        [HttpGet]
        public async Task<IEnumerable<Measurement>> Get()
        {
            var now = DateTimeOffset.UtcNow;

            var measurements = await this.context.Measurements
                .Where(m => EF.Functions.DateDiffHour(m.DateUpdated, now) < 48).ToArrayAsync();

            return measurements;
        }

        [HttpPost]
        public async Task<ActionResult> Post(Measurement measurement, [FromQuery]string apiKey)
        {
            if (apiKey != this.configuration["ApiKey"])
            {
                return this.BadRequest("Invalid API key");
            }

            this.context.Measurements.Add(measurement);
            _ = await this.context.SaveChangesAsync();
            this.logger.LogInformation($"Measurement {measurement.Id} added");
            return this.Ok();
        }
    }
}
