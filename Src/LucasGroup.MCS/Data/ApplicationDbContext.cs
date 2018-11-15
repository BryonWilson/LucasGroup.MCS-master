using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

using LucasGroup.MCS.Models;
using Microsoft.AspNetCore.Identity;

namespace LucasGroup.MCS.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Branch> Branches {get; set;}

        public DbSet<Candidate> Candidates { get; set; }

        public DbSet<Client> Clients { get; set; }
        public DbSet<Conference> Conferences { get; set; }
        public DbSet<ConferenceCandidate> ConferenceCandidates {get; set;}
        public DbSet<Contact> Contacts { get; set; }
        public DbSet<JobOrder> JobOrders { get; set; }
        public DbSet<ScheduleMatch> ScheduleMatches { get; set; }

        public DbSet<UserSettings> UserSettings { get; set; }

       protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Conference>().Metadata.FindNavigation(nameof(Conference.Candidates)).SetPropertyAccessMode(PropertyAccessMode.Field);
            modelBuilder.Entity<Conference>().Metadata.FindNavigation(nameof(Conference.JobOrders)).SetPropertyAccessMode(PropertyAccessMode.Field);
            modelBuilder.Entity<JobOrder>().Metadata.FindNavigation(nameof(JobOrder.ScheduleMatches)).SetPropertyAccessMode(PropertyAccessMode.Field);

            modelBuilder.Entity<Candidate>().HasData(CandidateSeed.AllCandidates());
            // modelBuilder.Entity<Client>().HasData(ClientSeed.AllClients());
            modelBuilder.Entity<Conference>().HasData(ConferenceSeed.AllConferences());
            // modelBuilder.Entity<JobOrder>().HasData(JobOrderSeed.AllJobOrders());
            modelBuilder.Entity<Branch>().HasData(BranchSeed.AllBranches());

       }
    }
}
