﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using BankApplicationDataAPI.Data;
using BankApplicationDataAPI.Models;
using Microsoft.EntityFrameworkCore;


namespace BankApplicationDataAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LogsController : ControllerBase
    {
        private readonly DBManager _databaseContext;

        public LogsController(DBManager databaseContext)
        {
            _databaseContext = databaseContext;
        }

        // GET: api/Logs
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Log>>> RetrieveAllLogs()
        {
            if (_databaseContext.Logs == null)
            {
                return NotFound("Log data is not available.");
            }
            return await _databaseContext.Logs.ToListAsync();
        }

        // GET: api/Logs/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Log>> RetrieveLogById(int id)
        {
            if (_databaseContext.Logs == null)
            {
                return NotFound("Log data is not available.");
            }
            var logEntry = await _databaseContext.Logs.FindAsync(id);

            if (logEntry == null)
            {
                return NotFound($"Log entry with ID {id} not found.");
            }

            return logEntry;
        }

        // PUT: api/Logs/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateLogEntry(int id, Log log)
        {
            if (id != log.LogId)
            {
                return BadRequest("Log ID mismatch.");
            }

            _databaseContext.Entry(log).State = EntityState.Modified;

            try
            {
                await _databaseContext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!LogEntryExists(id))
                {
                    return NotFound($"Log entry with ID {id} does not exist.");
                }
                throw;
            }

            return NoContent();
        }

        // POST: api/Logs
        [HttpPost]
        public async Task<ActionResult<Log>> CreateNewLog(Log log)
        {
            if (_databaseContext.Logs == null)
            {
                return Problem("Log set in DBManager is null.");
            }
            _databaseContext.Logs.Add(log);
            await _databaseContext.SaveChangesAsync();

            return CreatedAtAction(nameof(RetrieveLogById), new { id = log.LogId }, log);
        }

        // DELETE: api/Logs/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> RemoveLogEntry(int id)
        {
            if (_databaseContext.Logs == null)
            {
                return NotFound("Log data is not available.");
            }
            var logEntry = await _databaseContext.Logs.FindAsync(id);
            if (logEntry == null)
            {
                return NotFound($"Log entry with ID {id} not found.");
            }

            _databaseContext.Logs.Remove(logEntry);
            await _databaseContext.SaveChangesAsync();

            return NoContent();
        }

        private bool LogEntryExists(int id)
        {
            return (_databaseContext.Logs?.Any(e => e.LogId == id)).GetValueOrDefault();
        }
    }
}
