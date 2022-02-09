using LiveChat.Models;
using Microsoft.EntityFrameworkCore;

namespace LiveChat.DAL
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {

        }
        public DbSet<Room> Rooms { get; set; }
    }
}
