
export async function sleep( sec:number )
{
	return new Promise((resolve) => 
	{
		setTimeout(()=>{resolve(true);},sec * 1000 );
	});
}
