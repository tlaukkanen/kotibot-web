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
        public async Task<ActionResult<IEnumerable<Measurement>>> Get([FromQuery] int last)
        {
            if(last <= 0 || last > 168)
            {
                return new BadRequestObjectResult("Time range must be between 1 and 720 hours");
            }

            var now = DateTimeOffset.UtcNow;

            IEnumerable<Measurement> measurements;
            
            measurements = await this.context.Measurements
                .Where(m => EF.Functions.DateDiffHour(m.DateUpdated, now) < last)
                .ToArrayAsync();
           
            return new OkObjectResult(measurements);
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
