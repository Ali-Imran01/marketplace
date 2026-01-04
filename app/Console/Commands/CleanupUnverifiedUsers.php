<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use Carbon\Carbon;

class CleanupUnverifiedUsers extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'users:cleanup-unverified';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Delete unverified users older than 7 days';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $count = User::whereNull('email_verified_at')
            ->where('created_at', '<', Carbon::now()->subDays(7))
            ->delete();

        $this->info("Deleted {$count} unverified users.");
    }
}
