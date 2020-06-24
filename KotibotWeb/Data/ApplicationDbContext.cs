using KotibotWeb.Model;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace KotibotWeb.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(
            DbContextOptions options) : base(options)
        {
        }

        public DbSet<Measurement> Measurements { get; set; }
                
    }
    
}