using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using KotibotWeb.Data;
using KotibotWeb.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace KotibotWeb.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MeasurementsController : ControllerBase
    {
        private readonly ILogger<MeasurementsController> _logger;
        public readonly ApplicationDbContext _context;

        public MeasurementsController(
            ILogger<MeasurementsController> logger,
            ApplicationDbContext context)
        {
            _logger = logger;
            _context = context;
        }

        [HttpGet]
        public async Task<IEnumerable<Measurement>> Get()
        {
            var now = DateTimeOffset.UtcNow;

            var measurements = await _context.Measurements
                .Where(m => EF.Functions.DateDiffHour(m.DateUpdated, now) < 24 ).ToArrayAsync();
                
            return measurements;
        }

        [HttpPost]
        public async Task<ActionResult> Post(Measurement measurement)
        {
            _context.Measurements.Add(measurement);
            _ = await _context.SaveChangesAsync();
            return Ok();
        }
    }
}
