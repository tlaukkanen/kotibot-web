using KotibotWeb.Model;
using Microsoft.EntityFrameworkCore;

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